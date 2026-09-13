import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `<section class="mx-auto max-w-7xl px-4 py-16">Home — Phase 3</section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
