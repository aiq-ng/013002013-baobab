import { Routes } from '@angular/router';
import { ConsoleLayout } from '../../layouts/console-layout/console-layout';
import { authGuard } from './guards/auth.guard';

export const CONSOLE_ROUTES: Routes = [
  {
    path: '',
    component: ConsoleLayout,
    children: [
      {
        path: 'sign-in',
        loadComponent: () => import('./pages/sign-in/sign-in.page').then((m) => m.SignInPage),
      },
      {
        path: 'submissions',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/submissions/submissions.page').then((m) => m.SubmissionsPage),
      },
      {
        path: 'access-requests',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/access-requests/access-requests.page').then((m) => m.AccessRequestsPage),
      },
      { path: '', redirectTo: 'submissions', pathMatch: 'full' },
    ],
  },
];
