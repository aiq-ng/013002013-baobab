import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProgramsApi } from './programs.api';
import { PROGRAMS } from '../data/programs.data';
import { Program, RemoteProgram } from '../models/program';

function mergeRemote(base: readonly Program[], remote: readonly RemoteProgram[]): Program[] {
  const bySlug = new Map(remote.map((r) => [r.slug, r]));
  return base
    .map((program) => {
      const match = bySlug.get(program.slug);
      return match
        ? {
            ...program,
            title: match.title,
            description: match.description,
            imageUrl: match.imageUrl,
          }
        : program;
    })
    .sort((a, b) => (bySlug.get(a.slug)?.sortOrder ?? 0) - (bySlug.get(b.slug)?.sortOrder ?? 0));
}

/**
 * Public program listing, backed by the console-editable fields
 * (`GET /api/v1/programs`: title, description, imageUrl) merged onto the
 * fixed local content (kpis, pillars, milestones, doctrine copy) that has no
 * backend representation (plan §8d: "content-only editing").
 *
 * Starts from the static `PROGRAMS` fixture so the page never renders empty
 * or waits on the network, then refreshes in place once the registry responds.
 * A failed fetch leaves the static content on screen rather than erroring —
 * this is a display refresh, never the source of truth for what programs exist.
 */
@Injectable({ providedIn: 'root' })
export class ProgramsService {
  private readonly api = inject(ProgramsApi);

  private readonly _programs = signal<Program[]>(PROGRAMS);
  readonly programs = this._programs.asReadonly();

  async load(): Promise<void> {
    try {
      const remote = await firstValueFrom(this.api.list());
      this._programs.set(mergeRemote(PROGRAMS, remote));
    } catch {
      // Keep the static fallback already on screen.
    }
  }
}
