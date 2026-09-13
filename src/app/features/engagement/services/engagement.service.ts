import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EngagementRequest, EngagementResponse } from '../../../core/models/engagement-request';

/**
 * Single submission point for all 5 email-capture entry points across the site.
 * Mocked/stubbed — no real CMS/backend this phase — but shaped like a real API call
 * (Observable, async delay) so callers don't need to change when one lands.
 */
@Injectable({ providedIn: 'root' })
export class EngagementService {
  submit(request: EngagementRequest): Observable<EngagementResponse> {
    void request; // stubbed: no real CMS/backend this phase, payload isn't sent anywhere yet
    const response: EngagementResponse = {
      referenceId: this.generateReferenceId(),
      submittedAt: new Date().toISOString(),
    };
    return of(response).pipe(delay(300));
  }

  private generateReferenceId(): string {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `BB-${timestamp}-${random}`;
  }
}
