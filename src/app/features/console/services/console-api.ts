import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import {
  AdminAccessRequest,
  AdminEngagementList,
  AdminSession,
  SubmissionStatus,
} from '../models/admin';

const CSRF_COOKIE_NAME = 'baobab_admin_csrf';

/** Reads the non-HttpOnly CSRF cookie the session endpoint sets (plan §8c
 * double-submit token). Returns '' server-side or before sign-in. */
function readCsrfCookie(): string {
  if (typeof document === 'undefined') {
    return '';
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Typed client for the Registry Console admin API. Every call carries the
 * HttpOnly session cookie (`withCredentials`); every mutating call also
 * echoes the CSRF cookie back as a header, since the server rejects a
 * mismatch (double-submit CSRF, plan §8c).
 */
@Injectable({ providedIn: 'root' })
export class ConsoleApi {
  private readonly api = inject(ApiClient);

  private csrfHeaders(): Record<string, string> {
    return { 'X-CSRF-Token': readCsrfCookie() };
  }

  signIn(email: string, password: string): Observable<AdminSession> {
    return this.api.post<AdminSession>(
      'admin/session',
      { email, password },
      { withCredentials: true },
    );
  }

  readSession(): Observable<AdminSession> {
    return this.api.get<AdminSession>('admin/session', { withCredentials: true });
  }

  signOut(): Observable<void> {
    return this.api.delete<void>('admin/session', { withCredentials: true });
  }

  listEngagements(query: {
    source?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Observable<AdminEngagementList> {
    const params: Record<string, string> = {};
    if (query.source) params['source'] = query.source;
    if (query.status) params['status'] = query.status;
    if (query.page) params['page'] = String(query.page);
    if (query.pageSize) params['pageSize'] = String(query.pageSize);
    return this.api.get<AdminEngagementList>('admin/engagements', {
      withCredentials: true,
      params,
    });
  }

  updateEngagementStatus(id: string, status: SubmissionStatus): Observable<void> {
    return this.api.patch<void>(
      `admin/engagements/${id}`,
      { status },
      { withCredentials: true, headers: this.csrfHeaders() },
    );
  }

  listAccessRequests(state = 'pending'): Observable<AdminAccessRequest[]> {
    return this.api.get<AdminAccessRequest[]>('admin/access-requests', {
      withCredentials: true,
      params: { state },
    });
  }

  decideAccessRequest(
    id: string,
    decision: { approve: boolean; note?: string; expectedState: string },
  ): Observable<void> {
    return this.api.post<void>(
      `admin/access-requests/${id}/decide`,
      {
        approve: decision.approve,
        note: decision.note ?? null,
        expectedState: decision.expectedState,
      },
      { withCredentials: true, headers: this.csrfHeaders() },
    );
  }
}
