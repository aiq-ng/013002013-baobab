import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, from, map, mergeMap, catchError, throwError, filter, startWith } from 'rxjs';
import { ConsoleApi } from './console-api';
import { ImageUploadSignature } from '../models/admin';
import { hasPdfSignature } from '../utils/pdf-signature';
import { describeApiError } from '../utils/api-error';
import { formatFileSize } from '../utils/format';

export type PdfUploadEvent =
  { type: 'progress'; percent: number } | { type: 'done'; url: string; bytes: number };

/** Thrown for every failed upload; `message` is always safe to show an editor. */
export class PdfUploadError extends Error {
  override readonly name = 'PdfUploadError';
}

const CLOUDINARY_PDF = /^https:\/\/res\.cloudinary\.com\/[^\s/?#]+\/raw\/upload\/[^\s?#]+\.pdf$/i;
const NOT_A_PDF =
  'This file is not a valid PDF — it may be damaged or renamed from another format.';

function describeSignError(error: unknown): string {
  if (error instanceof HttpErrorResponse && error.status === 503) {
    return "PDF uploads aren't set up yet on this server.";
  }
  return describeApiError(error, 'Could not start the upload.');
}

/** Cloudinary's error bodies are never shown verbatim — they're provider detail. */
function describeUploadError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'The upload failed. Please try again.';
  if (error.status === 0) return 'The upload was interrupted. Check your connection and try again.';
  if (error.status === 400) return 'The file service rejected this file. Check it is a valid PDF.';
  if (error.status === 401 || error.status === 403) {
    return 'The upload authorisation expired. Please try again.';
  }
  if (error.status === 420 || error.status === 429) {
    return 'Too many uploads right now. Wait a minute, then try again.';
  }
  return 'The file service had a problem. Please try again shortly.';
}

/**
 * One resource PDF upload, end to end: check the `%PDF-` signature → ask the
 * API for a signed upload → enforce the server's size limit → send the file
 * directly to Cloudinary with progress. The PDF never passes through the API,
 * whose body limit is far below a real document's size.
 */
@Injectable({ providedIn: 'root' })
export class PdfUploader {
  private readonly api = inject(ConsoleApi);

  upload(file: File): Observable<PdfUploadEvent> {
    return from(hasPdfSignature(file)).pipe(
      mergeMap((isPdf) => (isPdf ? this.sign() : throwError(() => new PdfUploadError(NOT_A_PDF)))),
      mergeMap((signature) =>
        file.size > signature.maxBytes
          ? throwError(
              () =>
                new PdfUploadError(
                  `This PDF is ${formatFileSize(file.size)}. The limit is ${formatFileSize(signature.maxBytes)}.`,
                ),
            )
          : this.send(signature, file),
      ),
    );
  }

  private sign(): Observable<ImageUploadSignature> {
    return this.api
      .signPdfUpload()
      .pipe(catchError((error) => throwError(() => new PdfUploadError(describeSignError(error)))));
  }

  private send(signature: ImageUploadSignature, file: File): Observable<PdfUploadEvent> {
    return this.api.uploadImage(signature, file).pipe(
      catchError((error) => throwError(() => new PdfUploadError(describeUploadError(error)))),
      filter(
        (event) =>
          event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response,
      ),
      map((event): PdfUploadEvent => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
          return { type: 'progress', percent: Math.min(percent, 99) };
        }
        const body = event.type === HttpEventType.Response ? event.body : null;
        if (!body || !CLOUDINARY_PDF.test(body.secure_url ?? '')) {
          throw new PdfUploadError('The file service sent an unexpected response. Try again.');
        }
        return { type: 'done', url: body.secure_url, bytes: body.bytes || file.size };
      }),
      startWith<PdfUploadEvent>({ type: 'progress', percent: 0 }),
    );
  }
}
