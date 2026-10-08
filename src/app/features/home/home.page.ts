import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Hero } from './components/hero/hero';
import { MissionBlock } from './components/mission-block/mission-block';
import { PartnerCategories } from '../../shared/ui/partner-categories/partner-categories';
import { TrackModel } from './components/track-model/track-model';
import { ProgramsPreview } from './components/programs-preview/programs-preview';
import { ExpectedImpact } from './components/expected-impact/expected-impact';
import { DialogueForm } from './components/dialogue-form/dialogue-form';
import { CtaBand } from '../../shared/ui/cta-band/cta-band';
import { SeoService } from '../../core/services/seo.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { TrustBand } from '../../shared/ui/trust-band/trust-band';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    TrustBand,
    Hero,
    MissionBlock,
    PartnerCategories,
    TrackModel,
    ProgramsPreview,
    ExpectedImpact,
    DialogueForm,
    CtaBand,
    ScrollRevealDirective,
  ],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  private readonly seo = inject(SeoService);

  readonly showDialogueForm = signal(false);

  ngOnInit(): void {
    this.seo.update({
      title: 'Home',
      description:
        'The Baobab Group is a pan-West African peacebuilding and mediation institution strengthening peace and stability through non-kinetic approaches.',
    });
  }
}
