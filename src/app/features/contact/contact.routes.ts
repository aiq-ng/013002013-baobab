import { Routes } from '@angular/router';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./contact.page').then((m) => m.ContactPage),
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq-detail/faq-detail.page').then((m) => m.FaqDetailPage),
  },
];
