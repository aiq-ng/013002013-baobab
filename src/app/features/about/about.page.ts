import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  standalone: true,
  template: `<section class="mx-auto max-w-7xl px-4 py-16">About Us — Phase 4</section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {}
