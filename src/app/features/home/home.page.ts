import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Hero } from './components/hero/hero';
import { MissionBlock } from './components/mission-block/mission-block';
import { TrackModel } from './components/track-model/track-model';
import { ConciliationCycle } from './components/conciliation-cycle/conciliation-cycle';
import { TheaterPreviews } from './components/theater-previews/theater-previews';
import { ImpactStats } from './components/impact-stats/impact-stats';
import { DialogueForm } from './components/dialogue-form/dialogue-form';
import { LogoStrip, PartnerLogo } from '../../shared/ui/logo-strip/logo-strip';
import { CtaBand } from '../../shared/ui/cta-band/cta-band';
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
  selector: 'app-home-page',
  standalone: true,
  imports: [
    Hero,
    MissionBlock,
    TrackModel,
    ConciliationCycle,
    TheaterPreviews,
    ImpactStats,
    DialogueForm,
    LogoStrip,
    CtaBand,
  ],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  private readonly seo = inject(SeoService);

  readonly partnerLogos = PARTNER_LOGOS;
  readonly showDialogueForm = signal(false);

  ngOnInit(): void {
    this.seo.update({
      title: 'Home',
      description:
        'The Baobab Group bridges high-level statecraft, Track 1.5 dialogue, and customary sultanate councils to de-escalate structural conflicts across West Africa.',
    });
  }
}
