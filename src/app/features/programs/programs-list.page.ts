import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ProgramsHero } from './components/hero/hero';
import { StrategicPillars } from './components/strategic-pillars/strategic-pillars';
import { ProgramsTheaterSection } from './components/theater-section/theater-section';
import { SovereignDialogueForm } from './components/sovereign-dialogue-form/sovereign-dialogue-form';
import { Eyebrow } from '../../shared/ui/eyebrow/eyebrow';
import { ProgramGrid, ProgramPreview } from '../../shared/ui/program-grid/program-grid';
import { SeoService } from '../../core/services/seo.service';
import { PROGRAMS } from './data/programs.data';

@Component({
  selector: 'app-programs-list-page',
  standalone: true,
  imports: [
    ProgramsHero,
    StrategicPillars,
    ProgramsTheaterSection,
    SovereignDialogueForm,
    Eyebrow,
    ProgramGrid,
  ],
  templateUrl: './programs-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsListPage implements OnInit {
  private readonly seo = inject(SeoService);

  readonly activePrograms: ProgramPreview[] = PROGRAMS.map((program) => ({
    slug: program.slug,
    badgeText: program.badgeText,
    imageUrl: program.imageUrl,
    imageAlt: program.imageAlt,
    title: program.title,
    description: program.description,
  }));

  ngOnInit(): void {
    this.seo.update({
      title: 'Programs',
      description:
        "The Baobab Group's active Track 1.5 programs and theaters — cross-border customary accords de-escalating conflict across the Sahel and West Africa.",
    });
  }
}
