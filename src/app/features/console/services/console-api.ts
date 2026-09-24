import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { HttpClient } from '@angular/common/http';
import {
  AdminAccessRequest,
  AdminArchiveEntry,
  AdminEngagementList,
  AdminMetadataItem,
  AdminProgram,
  AdminResource,
  AdminSession,
  ArchiveEntryWrite,
  SubmissionStatus,
} from '../models/admin';
import { environment } from '../../../../environments/environment';

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
  private readonly http = inject(HttpClient);

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

  listPrograms(): Observable<AdminProgram[]> {
    return this.api.get<AdminProgram[]>('admin/programs', { withCredentials: true });
  }

  updateProgram(
    slug: string,
    patch: { title: string; description: string },
  ): Observable<AdminProgram> {
    return this.api.put<AdminProgram>(`admin/programs/${slug}`, patch, {
      withCredentials: true,
      headers: this.csrfHeaders(),
    });
  }

  listResources(): Observable<AdminResource[]> {
    return this.api.get<AdminResource[]>('admin/resources', { withCredentials: true });
  }

  /**
   * Multipart upload. `ApiClient` only exposes JSON-body helpers, so this
   * issues the request directly via `HttpClient` (same base-url resolution,
   * withCredentials + CSRF header pattern as every other mutating call here).
   * Content-Type is deliberately left unset so the browser attaches the
   * multipart boundary itself.
   */
  createResource(
    file: File,
    title: string,
    batchReference: string,
    languages: string,
  ): Observable<AdminResource> {
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('batch_reference', batchReference);
    form.append('languages', languages);

    const trimmedBase = environment.apiBaseUrl.replace(/\/+$/, '');
    return this.http.post<AdminResource>(`${trimmedBase}/admin/resources`, form, {
      withCredentials: true,
      headers: this.csrfHeaders(),
    });
  }

  setResourcePublished(id: string, published: boolean): Observable<AdminResource> {
    return this.api.patch<AdminResource>(
      `admin/resources/${id}/publish`,
      { published },
      { withCredentials: true, headers: this.csrfHeaders() },
    );
  }

  updateResourceCodexDetails(
    id: string,
    details: {
      batchLabel: string;
      releaseTag: string;
      documentDateLabel: string;
      description: string;
      chapters: string[];
      excerptHeading: string;
      excerptQuote: string;
      excerptAttribution: string;
      onlineUrl: string;
      metadata: AdminMetadataItem[];
    },
  ): Observable<AdminResource> {
    return this.api.patch<AdminResource>(`admin/resources/${id}/codex-details`, details, {
      withCredentials: true,
      headers: this.csrfHeaders(),
    });
  }

  listArchiveEntries(): Observable<AdminArchiveEntry[]> {
    return this.api.get<AdminArchiveEntry[]>('admin/archive', { withCredentials: true });
  }

  createArchiveEntry(entry: ArchiveEntryWrite): Observable<AdminArchiveEntry> {
    return this.api.post<AdminArchiveEntry>('admin/archive', entry, {
      withCredentials: true,
      headers: this.csrfHeaders(),
    });
  }

  updateArchiveEntry(id: string, entry: ArchiveEntryWrite): Observable<AdminArchiveEntry> {
    return this.api.put<AdminArchiveEntry>(`admin/archive/${id}`, entry, {
      withCredentials: true,
      headers: this.csrfHeaders(),
    });
  }

  setArchiveEntryPublished(id: string, published: boolean): Observable<AdminArchiveEntry> {
    return this.api.patch<AdminArchiveEntry>(
      `admin/archive/${id}/publish`,
      { published },
      { withCredentials: true, headers: this.csrfHeaders() },
    );
  }

  deleteArchiveEntry(id: string): Observable<void> {
    return this.api.delete<void>(`admin/archive/${id}`, {
      withCredentials: true,
      headers: this.csrfHeaders(),
    });
  }
}
