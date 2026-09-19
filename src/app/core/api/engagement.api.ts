import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';
import { ApiClient } from './api-client';
import { EngagementRequest, EngagementResponse } from '../models/engagement-request';

const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_BASE_DELAY_MS = 300;
const RETRY_JITTER_MS = 400;

/** Network error (no response reached the server) or 5xx — safe to retry once. */
function isRetryable(error: unknown): boolean {
  if (error instanceof HttpErrorResponse) {
    return error.status === 0 || error.status >= 500;
  }
  // A timeout (RxJS `TimeoutError`) never reached the server either.
  return error instanceof Error && error.name === 'TimeoutError';
}

function jitteredBackoff(attempt: number): number {
  return RETRY_BASE_DELAY_MS * attempt + Math.random() * RETRY_JITTER_MS;
}

/**
 * Typed client for `POST /engagements`, the single endpoint every form on the
 * site submits to. Never called directly by feature components — they go
 * through `EngagementService`.
 */
@Injectable({ providedIn: 'root' })
export class EngagementApi {
  private readonly api = inject(ApiClient);

  submit(request: EngagementRequest, idempotencyKey: string): Observable<EngagementResponse> {
    return this.api
      .post<EngagementResponse, EngagementRequest>('engagements', request, {
        headers: { 'Idempotency-Key': idempotencyKey },
      })
      .pipe(
        timeout(REQUEST_TIMEOUT_MS),
        retry({
          count: 1,
          delay: (error: unknown, retryCount: number) => {
            if (!isRetryable(error)) {
              return throwError(() => error);
            }
            return timer(jitteredBackoff(retryCount));
          },
        }),
      );
  }

  /** One UUID per form-fill (per component construction), sent as `Idempotency-Key`. */
  generateIdempotencyKey(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    // Fallback for environments without `crypto.randomUUID` (older SSR runtimes).
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
