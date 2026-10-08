import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, from, map, mergeMap, catchError, throwError, filter, startWith } from 'rxjs';
import { ConsoleApi } from './console-api';
import { ImageUploadSignature } from '../models/admin';
import { sniffImageFormat } from '../utils/image-signature';
import { describeApiError } from '../utils/api-error';

export type ImageUploadEvent =
  | { type: 'progress'; percent: number }
  | { type: 'done'; url: string; width: number; height: number };

/** Thrown for every failed upload; `message` is always safe to show an editor. */
export class ImageUploadError extends Error {
  override readonly name = 'ImageUploadError';
}

const CLOUDINARY_DELIVERY = /^https:\/\/res\.cloudinary\.com\/[^\s/]+\/image\/upload\/\S+$/;
const UNSUPPORTED = 'Choose a JPEG, PNG, WebP or AVIF image.';

function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, '')} MB`
    : `${Math.ceil(bytes / 1024)} KB`;
}

function describeSignError(error: unknown): string {
  if (error instanceof HttpErrorResponse && error.status === 503) {
    return "Image uploads aren't set up yet on this server. Paste an image URL instead.";
  }
  return describeApiError(error, 'Could not start the upload.');
}

/** Cloudinary's error bodies are never shown verbatim — they're provider detail. */
function describeUploadError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'The upload failed. Please try again.';
  if (error.status === 0) return 'The upload was interrupted. Check your connection and try again.';
  if (error.status === 400) {
    return `The image service rejected this file. ${UNSUPPORTED}`;
  }
  if (error.status === 401 || error.status === 403) {
    return 'The upload authorisation expired. Please try again.';
  }
  if (error.status === 420 || error.status === 429) {
    return 'Too many uploads right now. Wait a minute, then try again.';
  }
  return 'The image service had a problem. Please try again shortly.';
}

/**
 * One image upload, end to end: sniff the file's real format → ask the API
 * for a signed upload → enforce the server's size limit → send the file
 * directly to Cloudinary with progress. Unsubscribing aborts the request.
 */
@Injectable({ providedIn: 'root' })
export class ImageUploader {
  private readonly api = inject(ConsoleApi);

  upload(file: File): Observable<ImageUploadEvent> {
    return from(sniffImageFormat(file)).pipe(
      mergeMap((format) =>
        format ? this.sign() : throwError(() => new ImageUploadError(UNSUPPORTED)),
      ),
      mergeMap((signature) =>
        file.size > signature.maxBytes
          ? throwError(
              () =>
                new ImageUploadError(
                  `This image is ${formatBytes(file.size)}. The limit is ${formatBytes(signature.maxBytes)}.`,
                ),
            )
          : this.send(signature, file),
      ),
    );
  }

  private sign(): Observable<ImageUploadSignature> {
    return this.api
      .signImageUpload()
      .pipe(
        catchError((error) => throwError(() => new ImageUploadError(describeSignError(error)))),
      );
  }

  private send(signature: ImageUploadSignature, file: File): Observable<ImageUploadEvent> {
    return this.api.uploadImage(signature, file).pipe(
      catchError((error) => throwError(() => new ImageUploadError(describeUploadError(error)))),
      filter(
        (event) =>
          event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response,
      ),
      map((event): ImageUploadEvent => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
          return { type: 'progress', percent: Math.min(percent, 99) };
        }
        const body = event.type === HttpEventType.Response ? event.body : null;
        if (!body || !CLOUDINARY_DELIVERY.test(body.secure_url ?? '')) {
          throw new ImageUploadError('The image service sent an unexpected response. Try again.');
        }
        return { type: 'done', url: body.secure_url, width: body.width, height: body.height };
      }),
      startWith<ImageUploadEvent>({ type: 'progress', percent: 0 }),
    );
  }
}
