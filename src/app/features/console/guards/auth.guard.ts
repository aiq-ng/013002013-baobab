import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { ConsoleStore } from '../services/console-store';

/**
 * Guards every `/console` route except sign-in. SSR-safe (plan §8c): the
 * server has no cookie context worth trusting, so it renders through rather
 * than guessing — the console route is `RenderMode.Client` anyway (§8a), so
 * this only ever really executes in the browser. There, the API is the
 * authority: a 401 from `GET /admin/session` sends the visitor to sign-in
 * with a return URL, never a locally-cached "looks signed in" guess.
 */
export const authGuard: CanActivateFn = async (_route, state) => {
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return true;
  }

  const store = inject(ConsoleStore);
  const router = inject(Router);

  const signedIn = store.sessionChecked() ? store.isSignedIn() : await store.checkSession();
  if (signedIn) {
    return true;
  }

  return router.createUrlTree(['/console/sign-in'], { queryParams: { returnUrl: state.url } });
};
