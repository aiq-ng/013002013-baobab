import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { PartnershipsHero } from './components/hero/hero';
import { PartnershipsFeatureCards } from './components/feature-cards/feature-cards';
import { PartnershipsDialogueForm } from './components/dialogue-form/dialogue-form';
import { PartnershipsPartnerGroups } from './components/partner-groups/partner-groups';
import { SeoService } from '../../core/services/seo.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-partnerships-page',
  standalone: true,
  imports: [
    PartnershipsHero,
    PartnershipsFeatureCards,
    PartnershipsDialogueForm,
    PartnershipsPartnerGroups,
    ScrollRevealDirective,
  ],
  templateUrl: './partnerships.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnershipsPage implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Partnerships',
      description:
        'Partner with The Baobab Group for a stronger West Africa. We collaborate with governments, communities, regional institutions and international partners to build durable peace.',
    });
  }
}
