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
import { ToastService } from '../../shared/ui/toast/toast.service';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let clearSessionSpy: ReturnType<typeof vi.fn>;
  let toastErrorSpy: ReturnType<typeof vi.fn>;
  let signedIn: boolean;

  beforeEach(() => {
    navigateSpy = vi.fn().mockResolvedValue(true);
    signedIn = true;
    clearSessionSpy = vi.fn(() => (signedIn = false));
    toastErrorSpy = vi.fn();
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
          useValue: { clearSession: clearSessionSpy, isSignedIn: () => signedIn },
        },
        { provide: ToastService, useValue: { error: toastErrorSpy } },
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

  function failAdmin(url: string, status = 401): Promise<HttpErrorResponse> {
    const promise = new Promise<HttpErrorResponse>((resolve) => {
      httpClient.get(url).subscribe({ error: (err) => resolve(err) });
    });
    httpMock.expectOne(url).flush('x', { status, statusText: 'Err' });
    return promise;
  }

  it('tells the editor their session expired, once, even when several calls fail together', async () => {
    const first = failAdmin('/api/admin/engagements');
    const second = failAdmin('/api/admin/access-requests');
    await Promise.all([first, second]);

    expect(toastErrorSpy).toHaveBeenCalledTimes(1);
    expect(toastErrorSpy).toHaveBeenCalledWith(expect.stringContaining('session has expired'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('never logs request bodies or credentials, only method, url and status', async () => {
    await failAdmin('/api/admin/programs', 500);
    const logged = JSON.stringify(consoleErrorSpy.mock.calls);
    expect(logged).toContain('/api/admin/programs');
    expect(logged).not.toContain('HttpErrorResponse');
  });
});
