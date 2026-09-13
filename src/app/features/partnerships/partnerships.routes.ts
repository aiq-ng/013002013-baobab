import { Routes } from '@angular/router';

export const PARTNERSHIPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./partnerships.page').then((m) => m.PartnershipsPage),
  },
];
