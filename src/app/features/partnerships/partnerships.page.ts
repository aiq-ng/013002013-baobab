import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { PartnershipsHero } from './components/hero/hero';
import { PartnershipsFeatureCards } from './components/feature-cards/feature-cards';
import { PartnershipsDialogueForm } from './components/dialogue-form/dialogue-form';
import { LogoStrip, PartnerLogo } from '../../shared/ui/logo-strip/logo-strip';
import { SeoService } from '../../core/services/seo.service';

const PARTNER_LOGOS: PartnerLogo[] = [
  { name: 'UN Peacebuilding Fund', imageUrl: '/images/home/logos/peacebuilding.svg' },
  { name: 'BBC', imageUrl: '/images/home/logos/bbc.svg' },
  { name: 'African Union', imageUrl: '/images/home/logos/african-union.svg' },
  { name: 'United Nations', imageUrl: '/images/home/logos/united-nations.svg' },
  { name: 'Republic of Niger', imageUrl: '/images/home/logos/niger.svg' },
  { name: 'ECOWAS/CEDEAO', imageUrl: '/images/home/logos/ecowas.svg' },
  { name: 'Federal Republic of Nigeria', imageUrl: '/images/home/logos/nigeria.svg' },
];

@Component({
  selector: 'app-partnerships-page',
  standalone: true,
  imports: [PartnershipsHero, PartnershipsFeatureCards, PartnershipsDialogueForm, LogoStrip],
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
