import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConsoleApi } from './console-api';
import {
  AdminAccessRequest,
  AdminArchiveEntry,
  AdminEngagement,
  AdminMetadataItem,
  AdminProgram,
  AdminResource,
  AdminSession,
  ArchiveEntryWrite,
  ProgramCreate,
  ProgramWrite,
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

  private readonly _programs = signal<AdminProgram[]>([]);
  private readonly _programsLoading = signal(false);
  readonly programs = this._programs.asReadonly();
  readonly programsLoading = this._programsLoading.asReadonly();

  private readonly _resources = signal<AdminResource[]>([]);
  private readonly _resourcesLoading = signal(false);
  readonly resources = this._resources.asReadonly();
  readonly resourcesLoading = this._resourcesLoading.asReadonly();

  private readonly _archiveEntries = signal<AdminArchiveEntry[]>([]);
  private readonly _archiveEntriesLoading = signal(false);
  readonly archiveEntries = this._archiveEntries.asReadonly();
  readonly archiveEntriesLoading = this._archiveEntriesLoading.asReadonly();

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
      this.clearCollections();
    }
  }

  /** Drops a locally-held session without calling the API — for when the
   * server has already told us it's gone (e.g. a 401 from `errorInterceptor`). */
  clearSession(): void {
    this._session.set(null);
    this._sessionChecked.set(true);
    this.clearCollections();
  }

  /** Submissions and access requests hold visitors' names, emails and
   * messages — none of it may outlive the session that fetched it, or the
   * next person at a shared machine could read it back out of memory. */
  private clearCollections(): void {
    this._engagements.set([]);
    this._engagementsTotal.set(0);
    this._accessRequests.set([]);
    this._programs.set([]);
    this._resources.set([]);
    this._archiveEntries.set([]);
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

  async loadPrograms(): Promise<void> {
    this._programsLoading.set(true);
    try {
      const items = await firstValueFrom(this.api.listPrograms());
      this._programs.set(items);
    } finally {
      this._programsLoading.set(false);
    }
  }

  async createProgram(program: ProgramCreate): Promise<void> {
    await firstValueFrom(this.api.createProgram(program));
    await this.loadPrograms();
  }

  async saveProgram(slug: string, content: ProgramWrite): Promise<void> {
    await firstValueFrom(this.api.updateProgram(slug, content));
    await this.loadPrograms();
  }

  async deleteProgram(slug: string): Promise<void> {
    await firstValueFrom(this.api.deleteProgram(slug));
    await this.loadPrograms();
  }

  async loadResources(): Promise<void> {
    this._resourcesLoading.set(true);
    try {
      const items = await firstValueFrom(this.api.listResources());
      this._resources.set(items);
    } finally {
      this._resourcesLoading.set(false);
    }
  }

  async uploadResource(
    file: File,
    title: string,
    batchReference: string,
    languages: string,
  ): Promise<AdminResource> {
    const created = await firstValueFrom(
      this.api.createResource(file, title, batchReference, languages),
    );
    await this.loadResources();
    return created;
  }

  async setResourcePublished(id: string, published: boolean): Promise<void> {
    await firstValueFrom(this.api.setResourcePublished(id, published));
    await this.loadResources();
  }

  async updateResourceCodexDetails(
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
  ): Promise<void> {
    await firstValueFrom(this.api.updateResourceCodexDetails(id, details));
    await this.loadResources();
  }

  async loadArchiveEntries(): Promise<void> {
    this._archiveEntriesLoading.set(true);
    try {
      const items = await firstValueFrom(this.api.listArchiveEntries());
      this._archiveEntries.set(items);
    } finally {
      this._archiveEntriesLoading.set(false);
    }
  }

  async createArchiveEntry(entry: ArchiveEntryWrite): Promise<void> {
    await firstValueFrom(this.api.createArchiveEntry(entry));
    await this.loadArchiveEntries();
  }

  async updateArchiveEntry(id: string, entry: ArchiveEntryWrite): Promise<void> {
    await firstValueFrom(this.api.updateArchiveEntry(id, entry));
    await this.loadArchiveEntries();
  }

  async setArchiveEntryPublished(id: string, published: boolean): Promise<void> {
    await firstValueFrom(this.api.setArchiveEntryPublished(id, published));
    await this.loadArchiveEntries();
  }

  async deleteArchiveEntry(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteArchiveEntry(id));
    await this.loadArchiveEntries();
  }
}
