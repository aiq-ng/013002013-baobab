import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: HttpParams | Record<string, string>;
}

/**
 * Thin wrapper around `HttpClient` that resolves every path against
 * `environment.apiBaseUrl`, so feature code never hardcodes the host and
 * never calls `HttpClient` directly (per the centralized API layer rule).
 */
@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    return this.http.post<TResponse>(this.resolve(path), body, options);
  }

  get<TResponse>(path: string, options: ApiRequestOptions = {}): Observable<TResponse> {
    return this.http.get<TResponse>(this.resolve(path), options);
  }

  private resolve(path: string): string {
    const trimmedBase = this.baseUrl.replace(/\/+$/, '');
    const trimmedPath = path.replace(/^\/+/, '');
    return `${trimmedBase}/${trimmedPath}`;
  }
}
