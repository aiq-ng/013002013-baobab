import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-resources-page',
  standalone: true,
  template: `<section class="mx-auto max-w-7xl px-4 py-16">Resources — Phase 6</section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesPage {}
