import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { PartnershipsHero } from './components/hero/hero';
import { PartnershipsFeatureCards } from './components/feature-cards/feature-cards';
import { PartnershipsDialogueForm } from './components/dialogue-form/dialogue-form';
import { LogoStrip } from '../../shared/ui/logo-strip/logo-strip';
import { SeoService } from '../../core/services/seo.service';
import { PARTNER_LOGOS } from '../../shared/data/partner-logos.data';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-partnerships-page',
  standalone: true,
  imports: [
    PartnershipsHero,
    PartnershipsFeatureCards,
    PartnershipsDialogueForm,
    LogoStrip,
    ScrollRevealDirective,
  ],
  templateUrl: './partnerships.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnershipsPage implements OnInit {
  private readonly seo = inject(SeoService);

  readonly partnerLogos = PARTNER_LOGOS;

  ngOnInit(): void {
    this.seo.update({
      title: 'Partnerships',
      description:
        'The Baobab Group partners with multilateral institutions, sovereign ministries, and customary traditional leadership to anchor enduring sovereign peace across West Africa and the Sahel.',
    });
  }
}
