import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-programs-list-page',
  standalone: true,
  template: `<section class="mx-auto max-w-7xl px-4 py-16">Programs (listing) — Phase 5</section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsListPage {}
