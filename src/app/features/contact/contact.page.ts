import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ContactHero } from './components/hero/hero';
import { ContactForm } from './components/contact-form/contact-form';
import { ContactLocationBanner } from './components/location-banner/location-banner';
import { ContactFaq } from './components/faq/faq';
import { SeoService } from '../../core/services/seo.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ContactHero, ContactForm, ContactLocationBanner, ContactFaq, ScrollRevealDirective],
  templateUrl: './contact.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Contact Us',
      description:
        'Tell The Baobab Group about your organization, your question or your idea for working together.',
    });
  }
}
