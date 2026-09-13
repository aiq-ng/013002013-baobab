import { Routes } from '@angular/router';

export const ENGAGEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./success/success.page').then((m) => m.SuccessPage),
  },
];
