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
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
