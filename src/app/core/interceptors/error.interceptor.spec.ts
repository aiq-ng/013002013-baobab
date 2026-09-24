import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { errorInterceptor } from './error.interceptor';
import { ConsoleStore } from '../../features/console/services/console-store';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let clearSessionSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    navigateSpy = vi.fn().mockResolvedValue(true);
    clearSessionSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: { navigate: navigateSpy, url: '/console/submissions' },
        },
        {
          provide: ConsoleStore,
          useValue: { clearSession: clearSessionSpy },
        },
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

  it('redirects to console sign-in with a returnUrl on a 401 from an admin endpoint', async () => {
    const promise = new Promise<HttpErrorResponse>((resolve, reject) => {
      httpClient.get('/api/admin/engagements').subscribe({
        next: () => reject(new Error('expected an error')),
        error: (err) => resolve(err),
      });
    });

    httpMock
      .expectOne('/api/admin/engagements')
      .flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

    const error = await promise;
    expect(error.status).toBe(401);
    expect(navigateSpy).toHaveBeenCalledWith(['/console/sign-in'], {
      queryParams: { returnUrl: '/console/submissions' },
    });
    expect(clearSessionSpy).toHaveBeenCalled();
  });

  it('does not redirect on a 401 from the session endpoint itself', async () => {
    const promise = new Promise<HttpErrorResponse>((resolve, reject) => {
      httpClient.get('/api/admin/session').subscribe({
        next: () => reject(new Error('expected an error')),
        error: (err) => resolve(err),
      });
    });

    httpMock
      .expectOne('/api/admin/session')
      .flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

    await promise;
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('does not redirect on a 401 from a non-admin endpoint', async () => {
    const promise = new Promise<HttpErrorResponse>((resolve, reject) => {
      httpClient.get('/api/engagement').subscribe({
        next: () => reject(new Error('expected an error')),
        error: (err) => resolve(err),
      });
    });

    httpMock
      .expectOne('/api/engagement')
      .flush('unauthorized', { status: 401, statusText: 'Unauthorized' });

    await promise;
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
