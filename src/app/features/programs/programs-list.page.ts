import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { ProgramsHero } from './components/hero/hero';
import { StrategicPillars } from './components/strategic-pillars/strategic-pillars';
import { DispatchForm } from '../../shared/ui/dispatch-form/dispatch-form';
import { TrustBand } from '../../shared/ui/trust-band/trust-band';
import { Eyebrow } from '../../shared/ui/eyebrow/eyebrow';
import { ProgramGrid, ProgramPreview } from '../../shared/ui/program-grid/program-grid';
import { SeoService } from '../../core/services/seo.service';
import { ProgramsService } from './services/programs.service';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-programs-list-page',
  standalone: true,
  imports: [
    ProgramsHero,
    StrategicPillars,
    TrustBand,
    DispatchForm,
    Eyebrow,
    ProgramGrid,
    ScrollRevealDirective,
  ],
  templateUrl: './programs-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsListPage implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly programsService = inject(ProgramsService);

  readonly programsUnavailable = computed(
    () => this.programsService.status() === 'error' && this.programsService.programs().length === 0,
  );

  readonly activePrograms = computed<ProgramPreview[]>(() =>
    this.programsService.programs().map((program) => ({
      slug: program.slug,
      badgeText: program.badgeText,
      imageUrl: program.imageUrl,
      imageAlt: program.imageAlt,
      title: program.title,
      description: program.description,
    })),
  );

  ngOnInit(): void {
    this.seo.update({
      title: 'Programs',
      description:
        'The Baobab Group supports dialogue, mediation, community resilience, research, reintegration and policy across West Africa.',
    });
    void this.programsService.load();
  }
}
