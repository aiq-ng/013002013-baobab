import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { ArchiveEntry } from '../models/resource';

/** Typed client for the public, read-only `GET /api/v1/archive`. */
@Injectable({ providedIn: 'root' })
export class ArchiveApi {
  private readonly api = inject(ApiClient);

  list(): Observable<ArchiveEntry[]> {
    return this.api.get<ArchiveEntry[]>('archive');
  }
}
