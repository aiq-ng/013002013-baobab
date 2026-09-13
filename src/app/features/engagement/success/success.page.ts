import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-success-page',
  standalone: true,
  template: `<section class="mx-auto max-w-7xl px-4 py-16">
    Success confirmation — Phase 2
  </section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessPage {}
