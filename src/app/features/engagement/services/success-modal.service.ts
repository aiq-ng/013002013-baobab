import { Injectable, signal } from '@angular/core';
import { EngagementSource } from '../../../core/models/engagement-request';

export interface ActiveSuccessSubmission {
  source: EngagementSource;
  referenceId: string;
}

/**
 * Holds the currently-showing success submission, if any, so the shared
 * success modal (mounted once in `PublicLayout`) can be triggered by any
 * page's form without navigating away from it.
 */
@Injectable({ providedIn: 'root' })
export class SuccessModalService {
  private readonly state = signal<ActiveSuccessSubmission | null>(null);

  readonly current = this.state.asReadonly();

  show(source: EngagementSource, referenceId: string): void {
    this.state.set({ source, referenceId });
  }

  close(): void {
    this.state.set(null);
  }
}
