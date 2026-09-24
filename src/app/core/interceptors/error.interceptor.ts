import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ConsoleStore } from '../../features/console/services/console-store';

/**
 * A 401 from any `admin/` endpoint means the console session has expired
 * (or was never established) after the initial `authGuard` check already
 * passed — e.g. the cookie lapses while the admin is mid-page. The
 * `admin/session` endpoint itself is exempt: its own 401s are either the
 * guard's initial check or a failed sign-in attempt, both already handled
 * where they're called.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(ConsoleStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`[API error] ${req.method} ${req.url}`, error.status, error.message);

      if (
        error.status === 401 &&
        req.url.includes('/admin/') &&
        !req.url.endsWith('/admin/session')
      ) {
        store.clearSession();
        router.navigate(['/console/sign-in'], { queryParams: { returnUrl: router.url } });
      }

      return throwError(() => error);
    }),
  );
};
