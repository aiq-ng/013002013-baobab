import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom, lastValueFrom, toArray } from 'rxjs';
import { PdfUploadEvent, PdfUploader } from './pdf-uploader';
import { ImageUploadSignature } from '../models/admin';

const SIGN_URL = 'http://localhost:8000/api/v1/admin/media/pdf-uploads';
const UPLOAD_URL = 'https://api.cloudinary.com/v1_1/demo/raw/upload';
const SIGNATURE: ImageUploadSignature = {
  uploadUrl: UPLOAD_URL,
  fields: { api_key: '123', signature: 'abc', timestamp: '1', folder: 'baobab/resources' },
  maxBytes: 1024,
  allowedFormats: ['pdf'],
};
const SECURE_URL = 'https://res.cloudinary.com/demo/raw/upload/v1/baobab/resources/doc_x1.pdf';

function pdf(size = 64): File {
  const bytes = new Uint8Array(size);
  bytes.set([...'%PDF-'].map((c) => c.charCodeAt(0)));
  return new File([bytes], 'doc.pdf', { type: 'application/pdf' });
}

function setup() {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  return {
    uploader: TestBed.inject(PdfUploader),
    http: TestBed.inject(HttpTestingController),
  };
}

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve));

describe('PdfUploader', () => {
  it('signs, uploads straight to Cloudinary without cookies, and reports progress then the URL', async () => {
    const { uploader, http } = setup();
    const events = lastValueFrom(uploader.upload(pdf()).pipe(toArray()));
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
    upload.event({ type: 1, loaded: 16, total: 64 } as never);
    upload.flush({ secure_url: SECURE_URL, bytes: 64 });

    expect(await events).toEqual<PdfUploadEvent[]>([
      { type: 'progress', percent: 0 },
      { type: 'progress', percent: 25 },
      { type: 'done', url: SECURE_URL, bytes: 64 },
    ]);
    http.verify();
  });

  it('rejects a renamed non-PDF before asking the server for anything', async () => {
    const { uploader, http } = setup();
    const fake = new File(['<html></html>'], 'x.pdf', { type: 'application/pdf' });
    await expect(firstValueFrom(uploader.upload(fake))).rejects.toThrow('not a valid PDF');
    http.verify();
  });

  it('rejects a file over the server-provided size limit without uploading it', async () => {
    const { uploader, http } = setup();
    const result = firstValueFrom(uploader.upload(pdf(4096)));
    await flushMicrotasks();
    http.expectOne(SIGN_URL).flush(SIGNATURE);
    await expect(result).rejects.toThrow('This PDF is 4 KB. The limit is 1 KB.');
    http.verify();
  });

  it('explains when uploads are not configured on the server', async () => {
    const { uploader, http } = setup();
    const result = firstValueFrom(uploader.upload(pdf()));
    await flushMicrotasks();
    http.expectOne(SIGN_URL).flush({}, { status: 503, statusText: 'Unavailable' });
    await expect(result).rejects.toThrow("PDF uploads aren't set up yet");
  });

  it('turns a Cloudinary rejection into a message without echoing provider detail', async () => {
    const { uploader, http } = setup();
    const result = lastValueFrom(uploader.upload(pdf()));
    await flushMicrotasks();
    http.expectOne(SIGN_URL).flush(SIGNATURE);
    http
      .expectOne(UPLOAD_URL)
      .flush({ error: { message: 'Bad <script>' } }, { status: 400, statusText: 'Bad Request' });
    const error = await result.catch((e: Error) => e);
    expect((error as Error).message).toContain('rejected this file');
    expect((error as Error).message).not.toContain('<script>');
  });

  it('refuses a response URL that is not a Cloudinary raw PDF URL', async () => {
    const { uploader, http } = setup();
    const result = lastValueFrom(uploader.upload(pdf()));
    await flushMicrotasks();
    http.expectOne(SIGN_URL).flush(SIGNATURE);
    http.expectOne(UPLOAD_URL).flush({ secure_url: 'javascript:alert(1)', bytes: 1 });
    await expect(result).rejects.toThrow('unexpected response');
  });
});
