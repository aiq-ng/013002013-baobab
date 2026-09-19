import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ConsoleStore } from './console-store';
import { ConsoleApi } from './console-api';

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
});
