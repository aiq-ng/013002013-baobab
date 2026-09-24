import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { Program } from '../models/program';

/** Typed client for the public, read-only `GET /api/v1/programs[/:slug]`. */
@Injectable({ providedIn: 'root' })
export class ProgramsApi {
  private readonly api = inject(ApiClient);

  list(): Observable<Program[]> {
    return this.api.get<Program[]>('programs');
  }

  get(slug: string): Observable<Program> {
    return this.api.get<Program>(`programs/${encodeURIComponent(slug)}`);
  }
}
