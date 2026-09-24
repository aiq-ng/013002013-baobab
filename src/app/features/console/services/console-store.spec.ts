import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ConsoleStore } from './console-store';
import { ConsoleApi } from './console-api';
import { contentOf, createBodyOf, makeProgram } from '../../programs/testing/program-fixture';

const CODEX_FIELDS = {
  batchLabel: 'Annual Codex · Vol. IX',
  releaseTag: 'Permanent Archive Release',
  documentDateLabel: 'Annual Statecraft Review (2024–2025)',
  description: 'Desc',
  chapters: ['Ch. I'],
  excerptHeading: 'Excerpt',
  excerptQuote: 'Quote',
  excerptAttribution: 'Attribution',
  onlineUrl: '/doc.html',
  metadata: [
    { label: 'Label A', value: 'Value A', accent: true },
    { label: 'Label B', value: 'Value B', accent: false },
    { label: 'Label C', value: 'Value C', accent: false },
    { label: 'Label D', value: 'Value D', accent: true },
  ],
};

describe('ConsoleStore', () => {
  function setup(apiOverrides: Partial<ConsoleApi> = {}) {
    const apiStub: Partial<ConsoleApi> = {
      readSession: () => of({ email: 'a@b.example', role: 'reviewer' }),
      signIn: () => of({ email: 'a@b.example', role: 'reviewer' }),
      signOut: () => of(undefined),
      listEngagements: () => of({ items: [], total: 0, page: 1, pageSize: 25 }),
      updateEngagementStatus: () => of(undefined),
      listAccessRequests: () => of([]),
      decideAccessRequest: () => of(undefined),
      listPrograms: () => of([]),
      updateProgram: () => of(makeProgram({ slug: 'p1' })),
      createProgram: () => of(makeProgram({ slug: 'p1' })),
      deleteProgram: () => of(undefined),
      listResources: () => of([]),
      createResource: () =>
        of({
          id: 'r1',
          title: 'T',
          batchReference: 'Batch 1',
          languages: 'English',
          fileSizeBytes: 1000,
          uploadedAt: '2026-01-01T00:00:00Z',
          downloadUrl: '/r1.pdf',
          ...CODEX_FIELDS,
        }),
      setResourcePublished: () =>
        of({
          id: 'r1',
          title: 'T',
          batchReference: 'Batch 1',
          languages: 'English',
          fileSizeBytes: 1000,
          uploadedAt: '2026-01-01T00:00:00Z',
          downloadUrl: '/r1.pdf',
          ...CODEX_FIELDS,
        }),
      listArchiveEntries: () => of([]),
      createArchiveEntry: () =>
        of({
          id: 'a1',
          refCode: 'REF: BBG-1',
          regionTag: 'Region',
          statusTag: 'Ratified',
          title: 'T',
          description: 'D',
          ratifyingParties: 'Parties',
          workingLanguages: 'English',
          category: 'Transhumance',
          published: true,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        }),
      updateArchiveEntry: () =>
        of({
          id: 'a1',
          refCode: 'REF: BBG-1',
          regionTag: 'Region',
          statusTag: 'Ratified',
          title: 'T2',
          description: 'D',
          ratifyingParties: 'Parties',
          workingLanguages: 'English',
          category: 'Transhumance',
          published: true,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        }),
      setArchiveEntryPublished: () =>
        of({
          id: 'a1',
          refCode: 'REF: BBG-1',
          regionTag: 'Region',
          statusTag: 'Ratified',
          title: 'T',
          description: 'D',
          ratifyingParties: 'Parties',
          workingLanguages: 'English',
          category: 'Transhumance',
          published: false,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        }),
      deleteArchiveEntry: () => of(undefined),
      ...apiOverrides,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ConsoleApi, useValue: apiStub }],
    });
    return TestBed.inject(ConsoleStore);
  }

  it('starts signed out with no session checked yet', () => {
    const store = setup();
    expect(store.isSignedIn()).toBe(false);
    expect(store.sessionChecked()).toBe(false);
  });

  it('checkSession sets the session on success', async () => {
    const store = setup();
    const result = await store.checkSession();

    expect(result).toBe(true);
    expect(store.isSignedIn()).toBe(true);
    expect(store.session()).toEqual({ email: 'a@b.example', role: 'reviewer' });
    expect(store.sessionChecked()).toBe(true);
  });

  it('checkSession clears the session on failure', async () => {
    const store = setup({ readSession: () => throwError(() => new Error('401')) });
    const result = await store.checkSession();

    expect(result).toBe(false);
    expect(store.isSignedIn()).toBe(false);
    expect(store.sessionChecked()).toBe(true);
  });

  it('signIn sets the session', async () => {
    const store = setup();
    await store.signIn('a@b.example', 'pw');
    expect(store.isSignedIn()).toBe(true);
  });

  it('signOut clears the session even if the API call fails', async () => {
    const store = setup({ signOut: () => throwError(() => new Error('boom')) });
    await store.signIn('a@b.example', 'pw');

    await expect(store.signOut()).rejects.toThrow();
    expect(store.isSignedIn()).toBe(false);
  });

  it('loadEngagements populates rows and total, toggling loading', async () => {
    const store = setup({
      listEngagements: () =>
        of({
          items: [
            {
              id: '1',
              referenceId: 'BB-1',
              source: 'contact-form',
              name: 'A',
              email: 'a@b.example',
              message: null,
              status: 'new' as const,
              submittedAt: '2026-01-01T00:00:00Z',
            },
          ],
          total: 1,
          page: 1,
          pageSize: 25,
        }),
    });

    await store.loadEngagements({});

    expect(store.engagements().length).toBe(1);
    expect(store.engagementsTotal()).toBe(1);
    expect(store.engagementsLoading()).toBe(false);
  });

  it('setEngagementStatus calls the API then reloads the list', async () => {
    const listEngagements = vi
      .fn()
      .mockReturnValue(of({ items: [], total: 0, page: 1, pageSize: 25 }));
    const updateEngagementStatus = vi.fn().mockReturnValue(of(undefined));
    const store = setup({ listEngagements, updateEngagementStatus });

    await store.setEngagementStatus('1', 'actioned', {});

    expect(updateEngagementStatus).toHaveBeenCalledWith('1', 'actioned');
    expect(listEngagements).toHaveBeenCalled();
  });

  it('loadAccessRequests populates rows', async () => {
    const store = setup({
      listAccessRequests: () =>
        of([
          {
            id: '1',
            submissionId: 's1',
            referenceId: 'BB-1',
            name: 'A',
            email: 'a@b.example',
            delegationToken: null,
            institution: null,
            state: 'pending' as const,
            createdAt: '2026-01-01T00:00:00Z',
          },
        ]),
    });

    await store.loadAccessRequests();

    expect(store.accessRequests().length).toBe(1);
  });

  it('decideAccessRequest calls the API then reloads the queue', async () => {
    const listAccessRequests = vi.fn().mockReturnValue(of([]));
    const decideAccessRequest = vi.fn().mockReturnValue(of(undefined));
    const store = setup({ listAccessRequests, decideAccessRequest });

    await store.decideAccessRequest('1', { approve: true, expectedState: 'pending' });

    expect(decideAccessRequest).toHaveBeenCalledWith('1', {
      approve: true,
      expectedState: 'pending',
    });
    expect(listAccessRequests).toHaveBeenCalled();
  });

  it('loadPrograms populates rows, toggling loading', async () => {
    const store = setup({ listPrograms: () => of([makeProgram({ slug: 'p1' })]) });

    await store.loadPrograms();

    expect(store.programs().length).toBe(1);
    expect(store.programsLoading()).toBe(false);
  });

  it('saveProgram PUTs the full content then reloads the list', async () => {
    const listPrograms = vi.fn().mockReturnValue(of([]));
    const updateProgram = vi.fn().mockReturnValue(of(makeProgram({ slug: 'p1' })));
    const store = setup({ listPrograms, updateProgram });
    const content = contentOf(makeProgram());

    await store.saveProgram('p1', content);

    expect(updateProgram).toHaveBeenCalledWith('p1', content);
    expect(listPrograms).toHaveBeenCalled();
  });

  it('createProgram POSTs then reloads the list', async () => {
    const listPrograms = vi.fn().mockReturnValue(of([]));
    const createProgram = vi.fn().mockReturnValue(of(makeProgram({ slug: 'new-one' })));
    const store = setup({ listPrograms, createProgram });
    const body = createBodyOf(makeProgram({ slug: 'new-one' }));

    await store.createProgram(body);

    expect(createProgram).toHaveBeenCalledWith(body);
    expect(listPrograms).toHaveBeenCalled();
  });

  it('deleteProgram DELETEs then reloads the list', async () => {
    const listPrograms = vi.fn().mockReturnValue(of([]));
    const deleteProgram = vi.fn().mockReturnValue(of(undefined));
    const store = setup({ listPrograms, deleteProgram });

    await store.deleteProgram('p1');

    expect(deleteProgram).toHaveBeenCalledWith('p1');
    expect(listPrograms).toHaveBeenCalled();
  });

  it('deleteProgram propagates a failure without reloading', async () => {
    const listPrograms = vi.fn().mockReturnValue(of([]));
    const store = setup({
      listPrograms,
      deleteProgram: () => throwError(() => new Error('nope')),
    });

    await expect(store.deleteProgram('p1')).rejects.toThrow('nope');
    expect(listPrograms).not.toHaveBeenCalled();
  });

  it('loadResources populates rows, toggling loading', async () => {
    const store = setup({
      listResources: () =>
        of([
          {
            id: 'r1',
            title: 'Resource One',
            batchReference: 'Batch 1',
            languages: 'English',
            fileSizeBytes: 1000,
            uploadedAt: '2026-01-01T00:00:00Z',
            downloadUrl: '/r1.pdf',
            ...CODEX_FIELDS,
          },
        ]),
    });

    await store.loadResources();

    expect(store.resources().length).toBe(1);
    expect(store.resourcesLoading()).toBe(false);
  });

  it('uploadResource calls the API then reloads the list', async () => {
    const listResources = vi.fn().mockReturnValue(of([]));
    const createResource = vi.fn().mockReturnValue(
      of({
        id: 'r1',
        title: 'T',
        batchReference: 'Batch 1',
        languages: 'English',
        fileSizeBytes: 1000,
        uploadedAt: '2026-01-01T00:00:00Z',
        downloadUrl: '/r1.pdf',
        ...CODEX_FIELDS,
      }),
    );
    const store = setup({ listResources, createResource });
    const file = new File(['x'], 'x.pdf', { type: 'application/pdf' });

    await store.uploadResource(file, 'T', 'Batch 1', 'English');

    expect(createResource).toHaveBeenCalledWith(file, 'T', 'Batch 1', 'English');
    expect(listResources).toHaveBeenCalled();
  });

  it('setResourcePublished calls the API then reloads the list', async () => {
    const listResources = vi.fn().mockReturnValue(of([]));
    const setResourcePublished = vi.fn().mockReturnValue(
      of({
        id: 'r1',
        title: 'T',
        batchReference: 'Batch 1',
        languages: 'English',
        fileSizeBytes: 1000,
        uploadedAt: '2026-01-01T00:00:00Z',
        downloadUrl: null,
        ...CODEX_FIELDS,
      }),
    );
    const store = setup({ listResources, setResourcePublished });

    await store.setResourcePublished('r1', false);

    expect(setResourcePublished).toHaveBeenCalledWith('r1', false);
    expect(listResources).toHaveBeenCalled();
  });

  it('updateResourceCodexDetails calls the API then reloads the list', async () => {
    const listResources = vi.fn().mockReturnValue(of([]));
    const updateResourceCodexDetails = vi.fn().mockReturnValue(
      of({
        id: 'r1',
        title: 'T',
        batchReference: 'Batch 1',
        languages: 'English',
        fileSizeBytes: 1000,
        uploadedAt: '2026-01-01T00:00:00Z',
        downloadUrl: '/r1.pdf',
        ...CODEX_FIELDS,
      }),
    );
    const store = setup({ listResources, updateResourceCodexDetails });

    await store.updateResourceCodexDetails('r1', CODEX_FIELDS);

    expect(updateResourceCodexDetails).toHaveBeenCalledWith('r1', CODEX_FIELDS);
    expect(listResources).toHaveBeenCalled();
  });
});
