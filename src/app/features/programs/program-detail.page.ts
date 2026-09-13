import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-program-detail-page',
  standalone: true,
  template: `<section class="mx-auto max-w-7xl px-4 py-16">
    Program detail ({{ slug }}) — Phase 5
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramDetailPage {
  private readonly route = inject(ActivatedRoute);
  readonly slug = this.route.snapshot.paramMap.get('slug');
}
