import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConsoleApi } from './console-api';
import {
  AdminAccessRequest,
  AdminEngagement,
  AdminSession,
  SubmissionStatus,
} from '../models/admin';

/**
 * Signals-based shared state for the console (plan §8d: "Signals in a
 * ConsoleStore service" — nothing here justifies NgRx). Lists always refetch
 * after a mutation rather than patching local state optimistically (plan
 * §11f: "Console lists tolerate stale data"), so what's on screen is always
 * what the server just confirmed, never a guess.
 */
@Injectable({ providedIn: 'root' })
export class ConsoleStore {
  private readonly api = inject(ConsoleApi);

  private readonly _session = signal<AdminSession | null>(null);
  private readonly _sessionChecked = signal(false);
  readonly session = this._session.asReadonly();
  readonly sessionChecked = this._sessionChecked.asReadonly();
  readonly isSignedIn = computed(() => this._session() !== null);

  private readonly _engagements = signal<AdminEngagement[]>([]);
  private readonly _engagementsTotal = signal(0);
  private readonly _engagementsLoading = signal(false);
  readonly engagements = this._engagements.asReadonly();
  readonly engagementsTotal = this._engagementsTotal.asReadonly();
  readonly engagementsLoading = this._engagementsLoading.asReadonly();

  private readonly _accessRequests = signal<AdminAccessRequest[]>([]);
  private readonly _accessRequestsLoading = signal(false);
  readonly accessRequests = this._accessRequests.asReadonly();
  readonly accessRequestsLoading = this._accessRequestsLoading.asReadonly();

  async checkSession(): Promise<boolean> {
    try {
      const session = await firstValueFrom(this.api.readSession());
      this._session.set(session);
      return true;
    } catch {
      this._session.set(null);
      return false;
    } finally {
      this._sessionChecked.set(true);
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    const session = await firstValueFrom(this.api.signIn(email, password));
    this._session.set(session);
    this._sessionChecked.set(true);
  }

  async signOut(): Promise<void> {
    try {
      await firstValueFrom(this.api.signOut());
    } finally {
      this._session.set(null);
    }
  }

  async loadEngagements(query: {
    source?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<void> {
    this._engagementsLoading.set(true);
    try {
      const result = await firstValueFrom(this.api.listEngagements(query));
      this._engagements.set(result.items);
      this._engagementsTotal.set(result.total);
    } finally {
      this._engagementsLoading.set(false);
    }
  }

  async setEngagementStatus(
    id: string,
    status: SubmissionStatus,
    reloadQuery: { source?: string; status?: string; page?: number; pageSize?: number },
  ): Promise<void> {
    await firstValueFrom(this.api.updateEngagementStatus(id, status));
    await this.loadEngagements(reloadQuery);
  }

  async loadAccessRequests(state = 'pending'): Promise<void> {
    this._accessRequestsLoading.set(true);
    try {
      const items = await firstValueFrom(this.api.listAccessRequests(state));
      this._accessRequests.set(items);
    } finally {
      this._accessRequestsLoading.set(false);
    }
  }

  async decideAccessRequest(
    id: string,
    decision: { approve: boolean; note?: string; expectedState: string },
  ): Promise<void> {
    await firstValueFrom(this.api.decideAccessRequest(id, decision));
    await this.loadAccessRequests();
  }
}
