import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  template: `<section class="mx-auto max-w-7xl px-4 py-16">Contact Us — Phase 7</section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {}
