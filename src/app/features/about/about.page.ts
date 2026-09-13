import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AboutHero } from './components/hero/hero';
import { DocumentaryVideo } from './components/documentary-video/documentary-video';
import { MissionVisionPanel } from './components/mission-vision-panel/mission-vision-panel';
import { TheaterSection } from './components/theater-section/theater-section';
import { LogoStrip, PartnerLogo } from '../../shared/ui/logo-strip/logo-strip';
import { Eyebrow } from '../../shared/ui/eyebrow/eyebrow';
import { ProgramGrid, ProgramPreview } from '../../shared/ui/program-grid/program-grid';
import { SeoService } from '../../core/services/seo.service';
import { PROGRAMS } from '../programs/data/programs.data';

const PARTNER_LOGOS: PartnerLogo[] = [
  { name: 'UN Peacebuilding Fund', imageUrl: '/images/home/logos/peacebuilding.svg' },
  { name: 'BBC', imageUrl: '/images/home/logos/bbc.svg' },
  { name: 'African Union', imageUrl: '/images/home/logos/african-union.svg' },
  { name: 'United Nations', imageUrl: '/images/home/logos/united-nations.svg' },
  { name: 'Republic of Niger', imageUrl: '/images/home/logos/niger.svg' },
  { name: 'ECOWAS/CEDEAO', imageUrl: '/images/home/logos/ecowas.svg' },
  { name: 'Federal Republic of Nigeria', imageUrl: '/images/home/logos/nigeria.svg' },
];

const ACTIVE_PROGRAMS: ProgramPreview[] = PROGRAMS.map((program) => ({
  slug: program.slug,
  badgeText: program.badgeText,
  imageUrl: program.imageUrl,
  imageAlt: program.imageAlt,
  title: program.title,
  description: program.description,
}));

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    AboutHero,
    DocumentaryVideo,
    MissionVisionPanel,
    LogoStrip,
    Eyebrow,
    ProgramGrid,
    TheaterSection,
  ],
  templateUrl: './about.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage implements OnInit {
  private readonly seo = inject(SeoService);

  readonly partnerLogos = PARTNER_LOGOS;
  readonly activePrograms = ACTIVE_PROGRAMS;

  ngOnInit(): void {
    this.seo.update({
      title: 'About Us',
      description:
        'The Baobab Group is an independent Track 1.5 sovereign advisory and peacecraft institute convening confidential dialogue across the Sahel and West Africa.',
    });
  }
}
