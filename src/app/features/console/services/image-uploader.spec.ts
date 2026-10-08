import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom, lastValueFrom, toArray } from 'rxjs';
import { ImageUploadEvent, ImageUploader } from './image-uploader';
import { ImageUploadSignature } from '../models/admin';

const SIGN_URL = 'http://localhost:8000/api/v1/admin/media/image-uploads';
const UPLOAD_URL = 'https://api.cloudinary.com/v1_1/demo/image/upload';
const SIGNATURE: ImageUploadSignature = {
  uploadUrl: UPLOAD_URL,
  fields: { api_key: '123', signature: 'abc', timestamp: '1', folder: 'baobab/programs' },
  maxBytes: 1024,
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
};
const SECURE_URL = 'https://res.cloudinary.com/demo/image/upload/v1/baobab/programs/x.jpg';

function jpeg(size = 64): File {
  const bytes = new Uint8Array(size);
  bytes.set([0xff, 0xd8, 0xff, 0xe0]);
  return new File([bytes], 'photo.jpg', { type: 'image/jpeg' });
}

function setup() {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  return {
    uploader: TestBed.inject(ImageUploader),
    http: TestBed.inject(HttpTestingController),
  };
}

/** Lets the async magic-byte sniff resolve before asserting on requests. */
const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve));

describe('ImageUploader', () => {
  it('signs, uploads straight to Cloudinary without cookies, and reports progress then the URL', async () => {
    const { uploader, http } = setup();
    const events = lastValueFrom(uploader.upload(jpeg()).pipe(toArray()));
    await flushMicrotasks();

    const sign = http.expectOne(SIGN_URL);
    expect(sign.request.method).toBe('POST');
    expect(sign.request.withCredentials).toBe(true);
    sign.flush(SIGNATURE);

    const upload = http.expectOne(UPLOAD_URL);
    expect(upload.request.withCredentials).toBe(false);
    const body = upload.request.body as FormData;
    expect(body.get('signature')).toBe('abc');
    expect(body.get('file')).toBeInstanceOf(File);
    upload.event({ type: 1, loaded: 32, total: 64 } as never);
    upload.flush({ secure_url: SECURE_URL, width: 2000, height: 1200, bytes: 64, format: 'jpg' });

    expect(await events).toEqual<ImageUploadEvent[]>([
      { type: 'progress', percent: 0 },
      { type: 'progress', percent: 50 },
      { type: 'done', url: SECURE_URL, width: 2000, height: 1200 },
    ]);
    http.verify();
  });

  it('rejects a non-image before asking the server for anything', async () => {
    const { uploader, http } = setup();
    const svg = new File(['<svg onload=alert(1)></svg>'], 'x.png', { type: 'image/png' });
    await expect(firstValueFrom(uploader.upload(svg))).rejects.toThrow(
      'Choose a JPEG, PNG, WebP or AVIF image.',
    );
    http.verify();
  });

  it('rejects a file over the server-provided size limit without uploading it', async () => {
    const { uploader, http } = setup();
    const result = firstValueFrom(uploader.upload(jpeg(4096)));
    await flushMicrotasks();
    http.expectOne(SIGN_URL).flush(SIGNATURE);
    await expect(result).rejects.toThrow('This image is 4 KB. The limit is 1 KB.');
    http.verify();
  });

  it('explains when uploads are not configured on the server', async () => {
    const { uploader, http } = setup();
    const result = firstValueFrom(uploader.upload(jpeg()));
    await flushMicrotasks();
    http.expectOne(SIGN_URL).flush({}, { status: 503, statusText: 'Unavailable' });
    await expect(result).rejects.toThrow("Image uploads aren't set up yet");
  });

  it('turns a Cloudinary rejection into a message without echoing provider detail', async () => {
    const { uploader, http } = setup();
    const result = lastValueFrom(uploader.upload(jpeg()));
    await flushMicrotasks();
    http.expectOne(SIGN_URL).flush(SIGNATURE);
    http
      .expectOne(UPLOAD_URL)
      .flush(
        { error: { message: 'Invalid image file <script>' } },
        { status: 400, statusText: 'Bad Request' },
      );
    const error = await result.catch((e: Error) => e);
    expect((error as Error).message).toContain('rejected this file');
    expect((error as Error).message).not.toContain('<script>');
  });

  it('explains a network failure during upload', async () => {
    const { uploader, http } = setup();
    const result = lastValueFrom(uploader.upload(jpeg()));
    await flushMicrotasks();
    http.expectOne(SIGN_URL).flush(SIGNATURE);
    http.expectOne(UPLOAD_URL).error(new ProgressEvent('error'), { status: 0 });
    await expect(result).rejects.toThrow('Check your connection');
  });

  it('refuses a response URL that is not a Cloudinary https URL', async () => {
    const { uploader, http } = setup();
    const result = lastValueFrom(uploader.upload(jpeg()));
    await flushMicrotasks();
    http.expectOne(SIGN_URL).flush(SIGNATURE);
    http.expectOne(UPLOAD_URL).flush({ secure_url: 'javascript:alert(1)', width: 1, height: 1 });
    await expect(result).rejects.toThrow('unexpected response');
  });

  it('aborts the upload request when the caller unsubscribes', async () => {
    const { uploader, http } = setup();
    const sub = uploader.upload(jpeg()).subscribe({ error: () => undefined });
    await flushMicrotasks();
    http.expectOne(SIGN_URL).flush(SIGNATURE);
    const upload = http.expectOne(UPLOAD_URL);
    sub.unsubscribe();
    expect(upload.cancelled).toBe(true);
  });
});
