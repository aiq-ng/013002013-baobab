import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';

export const routes: Routes = [
  {
    path: 'console',
    loadChildren: () => import('./features/console/console.routes').then((m) => m.CONSOLE_ROUTES),
  },
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'about',
        loadChildren: () => import('./features/about/about.routes').then((m) => m.ABOUT_ROUTES),
      },
      {
        path: 'programs',
        loadChildren: () =>
          import('./features/programs/programs.routes').then((m) => m.PROGRAMS_ROUTES),
      },
      {
        path: 'resources',
        loadChildren: () =>
          import('./features/resources/resources.routes').then((m) => m.RESOURCES_ROUTES),
      },
      {
        path: 'partnerships',
        loadChildren: () =>
          import('./features/partnerships/partnerships.routes').then((m) => m.PARTNERSHIPS_ROUTES),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/contact/contact.routes').then((m) => m.CONTACT_ROUTES),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/not-found/not-found.page').then((m) => m.NotFoundPage),
      },
    ],
  },
];
