import { Routes } from '@angular/router';
import { ConsoleLayout } from '../../layouts/console-layout/console-layout';
import { authGuard } from './guards/auth.guard';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

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
      {
        path: 'programs',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/programs/programs.page').then((m) => m.ProgramsPage),
      },
      {
        path: 'programs/new',
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./pages/programs/program-edit/program-edit.page').then((m) => m.ProgramEditPage),
      },
      {
        path: 'programs/:slug',
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./pages/programs/program-edit/program-edit.page').then((m) => m.ProgramEditPage),
      },
      {
        path: 'resources',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/resources/resources.page').then((m) => m.ResourcesPage),
      },
      {
        path: 'resources/new',
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./pages/resources/resource-edit/resource-edit.page').then(
            (m) => m.ResourceEditPage,
          ),
      },
      {
        path: 'resources/:id',
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./pages/resources/resource-edit/resource-edit.page').then(
            (m) => m.ResourceEditPage,
          ),
      },
      {
        path: 'archive',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/archive/archive.page').then((m) => m.ArchivePage),
      },
      {
        path: 'archive/new',
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./pages/archive/archive-edit/archive-edit.page').then((m) => m.ArchiveEditPage),
      },
      {
        path: 'archive/:id',
        canActivate: [authGuard],
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./pages/archive/archive-edit/archive-edit.page').then((m) => m.ArchiveEditPage),
      },
      { path: '', redirectTo: 'submissions', pathMatch: 'full' },
      // An unknown console URL stays inside the console rather than falling
      // through to the public site's 404.
      { path: '**', redirectTo: 'submissions' },
    ],
  },
];
