import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Programs are created, edited and deleted in the Registry Console, so the
  // pages that show them render per request rather than at build time — a
  // prerendered copy would keep serving (and hydrating from) stale data until
  // the next deploy, and a new program's slug isn't known at build time.
  {
    path: 'programs',
    renderMode: RenderMode.Server,
  },
  {
    path: 'programs/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'about',
    renderMode: RenderMode.Server,
  },
  // Never prerendered: an authenticated area has no business in a static
  // build, and prerendering it would mean writing its HTML to disk (plan §8a).
  {
    path: 'console/**',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
