import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EngagementApi } from '../../../core/api/engagement.api';
import { EngagementRequest, EngagementResponse } from '../../../core/models/engagement-request';

/**
 * Single submission point for all email-capture entry points across the site.
 * Delegates to `EngagementApi` (the real `POST /engagements` call) — callers
 * never touch `HttpClient` directly, per the centralized API layer rule.
 */
@Injectable({ providedIn: 'root' })
export class EngagementService {
  private readonly engagementApi = inject(EngagementApi);

  submit(request: EngagementRequest, idempotencyKey: string): Observable<EngagementResponse> {
    return this.engagementApi.submit(request, idempotencyKey);
  }

  /** One UUID per form-fill — callers generate this once (e.g. at construction) and reuse it across retries. */
  generateIdempotencyKey(): string {
    return this.engagementApi.generateIdempotencyKey();
  }
}
