import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-7xl px-4 py-24 text-center">
      <h1 class="text-3xl font-bold">Page not found</h1>
      <p class="mt-2 text-ink-950/70">The page you're looking for doesn't exist.</p>
      <a routerLink="/" class="mt-6 inline-block text-brand-700 underline">Return home</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
