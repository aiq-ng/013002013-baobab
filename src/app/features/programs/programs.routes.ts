import { Routes } from '@angular/router';

export const PROGRAMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./programs-list.page').then((m) => m.ProgramsListPage),
  },
  {
    path: ':slug',
    loadComponent: () => import('./program-detail.page').then((m) => m.ProgramDetailPage),
  },
];
