import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../shared/ui/button/button';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink, Button],
  template: `
    <section
      class="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center"
    >
      <p class="text-sm font-semibold uppercase tracking-wide text-brand-700">Error 404</p>
      <h1 class="mt-3 text-3xl font-bold text-ink-950 sm:text-4xl">Page not found</h1>
      <p class="mt-4 text-ink-950/70">
        The dispatch you're looking for doesn't exist or may have been reclassified.
      </p>
      <app-button
        class="mt-8 inline-block"
        label="Return Home"
        variant="primary"
        routerLink="/"
        ctaId="not-found-return-home"
      />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.update({
      title: 'Page Not Found',
      description: "The page you're looking for doesn't exist.",
      noIndex: true,
    });
  }
}
