import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    httpMock.verify();
    consoleErrorSpy.mockRestore();
  });

  it('passes through a successful response unchanged', async () => {
    const promise = new Promise((resolve) => {
      httpClient.get('/api/ping').subscribe((res) => resolve(res));
    });

    httpMock.expectOne('/api/ping').flush({ ok: true });

    await expect(promise).resolves.toEqual({ ok: true });
  });

  it('logs and rethrows on an HTTP error', async () => {
    const promise = new Promise<HttpErrorResponse>((resolve, reject) => {
      httpClient.get('/api/ping').subscribe({
        next: () => reject(new Error('expected an error')),
        error: (err) => resolve(err),
      });
    });

    httpMock.expectOne('/api/ping').flush('failure', { status: 500, statusText: 'Server Error' });

    const error = await promise;
    expect(error.status).toBe(500);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
