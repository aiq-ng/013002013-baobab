import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';
import { authGuard } from './auth.guard';
import { ConsoleStore } from '../services/console-store';

describe('authGuard', () => {
  function setup(platformId: string, checkSessionResult: boolean) {
    const checkSession = vi.fn().mockResolvedValue(checkSessionResult);
    const storeStub = {
      sessionChecked: () => false,
      isSignedIn: () => checkSessionResult,
      checkSession,
    };
    const createUrlTree = vi.fn().mockReturnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: ConsoleStore, useValue: storeStub },
        { provide: Router, useValue: { createUrlTree } },
      ],
    });

    return { checkSession, createUrlTree };
  }

  it('allows navigation on the server without checking session state', async () => {
    const { checkSession } = setup('server', false);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/console/submissions' } as never),
    );

    expect(result).toBe(true);
    expect(checkSession).not.toHaveBeenCalled();
  });

  it('allows navigation in the browser when the session check succeeds', async () => {
    setup('browser', true);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/console/submissions' } as never),
    );

    expect(result).toBe(true);
  });

  it('redirects to sign-in with a returnUrl when the session check fails', async () => {
    const { createUrlTree } = setup('browser', false);

    await TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/console/submissions' } as never),
    );

    expect(createUrlTree).toHaveBeenCalledWith(['/console/sign-in'], {
      queryParams: { returnUrl: '/console/submissions' },
    });
  });
});
