import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { RemoteProgram } from '../models/program';

/** Typed client for the public, read-only `GET /api/v1/programs`. */
@Injectable({ providedIn: 'root' })
export class ProgramsApi {
  private readonly api = inject(ApiClient);

  list(): Observable<RemoteProgram[]> {
    return this.api.get<RemoteProgram[]>('programs');
  }
}
