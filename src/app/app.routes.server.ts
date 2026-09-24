import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROGRAMS } from './features/programs/data/programs.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'programs/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return PROGRAMS.map((program) => ({ slug: program.slug }));
    },
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
