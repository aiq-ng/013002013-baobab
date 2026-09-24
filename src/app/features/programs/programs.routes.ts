import { Routes } from '@angular/router';
import { programResolver } from './resolvers/program.resolver';

export const PROGRAMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./programs-list.page').then((m) => m.ProgramsListPage),
  },
  {
    path: ':slug',
    resolve: { program: programResolver },
    loadComponent: () => import('./program-detail.page').then((m) => m.ProgramDetailPage),
  },
];
