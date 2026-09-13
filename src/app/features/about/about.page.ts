import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AboutHero } from './components/hero/hero';
import { DocumentaryVideo } from './components/documentary-video/documentary-video';
import { MissionVisionPanel } from './components/mission-vision-panel/mission-vision-panel';
import { TheaterSection } from './components/theater-section/theater-section';
import { LogoStrip, PartnerLogo } from '../../shared/ui/logo-strip/logo-strip';
import { Eyebrow } from '../../shared/ui/eyebrow/eyebrow';
import { ProgramGrid, ProgramPreview } from '../../shared/ui/program-grid/program-grid';
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

const ACTIVE_PROGRAMS: ProgramPreview[] = [
  {
    slug: 'liptako-gourma-peace-corridor',
    badgeText: 'SAHEL CENTRAL',
    imageUrl: '/images/about/program-liptako-gourma.jpg',
    imageAlt: 'A ceremonial border crossing arch flying Mali and Burkina Faso flags',
    title: 'Liptako-Gourma Peace Corridor',
    description:
      'Establishment of bi-annual customary transit protocols across Mali, Niger, and Burkina Faso, reducing arme…',
  },
  {
    slug: 'lake-chad-customary-demobilization',
    badgeText: 'LAKE CHAD BASIN',
    imageUrl: '/images/about/program-lake-chad.jpg',
    imageAlt: 'A gathering beneath a large tree near Lake Chad',
    title: 'Lake Chad Customary Demobilization',
    description:
      'Traditional emirate truth-telling circles and reintegration screenings enabling 3,400 former auxiliary fighters to…',
  },
  {
    slug: 'gulf-of-guinea-northern-flank',
    badgeText: 'LITTORAL BUFFER',
    imageUrl: '/images/about/program-gulf-of-guinea.jpg',
    imageAlt: 'An aerial view of the Gulf of Guinea coastline',
    title: 'Gulf of Guinea Northern Flank',
    description:
      'Pre-emptive dialogue alliances across northern Ghana, Togo, Benin, and Côte d’Ivoire to build sovereign buffers th…',
  },
  {
    slug: 'gourma-pastoral-wells-demarcation',
    badgeText: 'SAHEL CENTRAL',
    imageUrl: '/images/about/program-gourma-wells.jpg',
    imageAlt: 'Pastoral wells at dusk in the Gourma region',
    title: 'Gourma Pastoral Wells & Demarcation',
    description:
      'Cooperative water point agreements negotiated among Fulani pastoralists and Dogon farming collectives…',
  },
  {
    slug: 'cross-border-chieftaincy-accords',
    badgeText: 'CONTINENTAL ECOWAS',
    imageUrl: '/images/about/program-chieftaincy-accords.jpg',
    imageAlt: 'A formal chieftaincy accord signing ceremony',
    title: 'Cross-Border Chieftaincy Accords',
    description:
      'Institutionalizing customary border jurisdiction, enabling traditional rulers to adjudicate inter-ethnic civil disputes',
  },
  {
    slug: 'riparian-water-fishery-protocols',
    badgeText: 'CONTINENTAL ECOWAS',
    imageUrl: '/images/about/program-riparian-fishery.jpg',
    imageAlt: 'Fishers on a river at dawn',
    title: 'Riparian Water & Fishery Protocols',
    description:
      'Standardized fishing calendar allocations and seasonal tributary conservation zones ratified across Cameroon…',
  },
];

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
