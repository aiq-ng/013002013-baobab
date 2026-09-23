import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api-client';
import { RegistryDocument } from '../models/resource';

/** Typed client for the public, read-only `GET /api/v1/resources`. */
@Injectable({ providedIn: 'root' })
export class ResourcesApi {
  private readonly api = inject(ApiClient);

  list(): Observable<RegistryDocument[]> {
    return this.api.get<RegistryDocument[]>('resources');
  }
}
