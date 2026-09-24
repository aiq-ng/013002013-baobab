import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ProgramsApi } from '../services/programs.api';
import { ProgramsService } from '../services/programs.service';
import { Program } from '../models/program';

/**
 * Resolves `programs/:slug` before the page renders, so server rendering
 * emits the full program and an unknown slug never flashes an empty page.
 * A 404 redirects to not-found; any other failure resolves `null`, which the
 * page shows as "temporarily unavailable" rather than claiming the program
 * doesn't exist.
 */
export const programResolver: ResolveFn<Program | null> = (route) => {
  const slug = route.paramMap.get('slug') ?? '';
  const cached = inject(ProgramsService).findLoaded(slug);
  if (cached) {
    return cached;
  }

  const router = inject(Router);
  return inject(ProgramsApi)
    .get(slug)
    .pipe(
      catchError((error: unknown) =>
        of(
          error instanceof HttpErrorResponse && error.status === 404
            ? new RedirectCommand(router.parseUrl('/not-found'), { skipLocationChange: true })
            : null,
        ),
      ),
    );
};
