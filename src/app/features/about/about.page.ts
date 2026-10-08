import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AboutHero } from './components/hero/hero';
import { ImageBanner } from './components/image-banner/image-banner';
import { MissionVisionPanel } from './components/mission-vision-panel/mission-vision-panel';
import { WhyBaobab } from './components/why-baobab/why-baobab';
import { ApproachGrid } from './components/approach-grid/approach-grid';
import { CoreValues } from './components/core-values/core-values';
import { WhereWeWork } from './components/where-we-work/where-we-work';
import { PartnerCategories } from '../../shared/ui/partner-categories/partner-categories';
import { SeoService } from '../../core/services/seo.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    AboutHero,
    ImageBanner,
    MissionVisionPanel,
    PartnerCategories,
    WhyBaobab,
    ApproachGrid,
    CoreValues,
    WhereWeWork,
    ScrollRevealDirective,
  ],
  templateUrl: './about.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'About Us',
      description:
        'The Baobab Group is an African-led institution for peace and dialogue, working with governments, communities and regional bodies across West Africa.',
    });
  }
}
