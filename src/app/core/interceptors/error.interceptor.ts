import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ConsoleStore } from '../../features/console/services/console-store';
import { ToastService } from '../../shared/ui/toast/toast.service';

/**
 * A 401 from any `admin/` endpoint means the console session has expired
 * (or was never established) after the initial `authGuard` check already
 * passed — e.g. the cookie lapses while the admin is mid-page. The
 * `admin/session` endpoint itself is exempt: its own 401s are either the
 * guard's initial check or a failed sign-in attempt, both already handled
 * where they're called.
 *
 * Only the first 401 of a burst acts (the store is signed out by then), so
 * parallel calls failing together produce one toast and one redirect.
 * Logging is limited to method, URL and status — never bodies, which can
 * carry credentials or visitors' personal data.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(ConsoleStore);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`[API error] ${req.method} ${req.url}`, error.status);

      if (
        error.status === 401 &&
        req.url.includes('/admin/') &&
        !req.url.endsWith('/admin/session') &&
        store.isSignedIn()
      ) {
        store.clearSession();
        toast.error('Your session has expired. Sign in again to continue.');
        router.navigate(['/console/sign-in'], { queryParams: { returnUrl: router.url } });
      }

      return throwError(() => error);
    }),
  );
};
