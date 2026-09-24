import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProgramsApi } from './programs.api';
import { Program } from '../models/program';

export type ProgramsStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Public program listing (Programs page, About). The registry
 * (`GET /api/v1/programs`) is the single source of truth — programs are
 * created, edited and deleted in the Registry Console, so there is no local
 * fixture to fall back on. A failed fetch keeps whatever was last loaded and
 * reports `error` so the page can say so instead of rendering a silent gap.
 */
@Injectable({ providedIn: 'root' })
export class ProgramsService {
  private readonly api = inject(ProgramsApi);

  private readonly _programs = signal<Program[]>([]);
  private readonly _status = signal<ProgramsStatus>('idle');
  readonly programs = this._programs.asReadonly();
  readonly status = this._status.asReadonly();

  async load(): Promise<void> {
    this._status.set('loading');
    try {
      this._programs.set(await firstValueFrom(this.api.list()));
      this._status.set('loaded');
    } catch {
      this._status.set('error');
    }
  }

  /** A program from the last successful load, so list → detail navigation needn't refetch. */
  findLoaded(slug: string): Program | undefined {
    return this._programs().find((program) => program.slug === slug);
  }
}
