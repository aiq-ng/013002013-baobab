import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgramBreadcrumb } from './components/breadcrumb/breadcrumb';
import { KpiGrid } from './components/kpi-grid/kpi-grid';
import { DoctrineSection } from './components/doctrine-section/doctrine-section';
import { OperationalPillars } from './components/operational-pillars/operational-pillars';
import { AccordTimeline } from './components/accord-timeline/accord-timeline';
import { DispatchForm } from '../../shared/ui/dispatch-form/dispatch-form';
import { SeoService } from '../../core/services/seo.service';
import { BackLink } from '../../shared/ui/back-link/back-link';
import { Program } from './models/program';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-program-detail-page',
  standalone: true,
  imports: [
    ProgramBreadcrumb,
    KpiGrid,
    DoctrineSection,
    OperationalPillars,
    AccordTimeline,
    DispatchForm,
    ScrollRevealDirective,
    BackLink,
  ],
  templateUrl: './program-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * `programs/:slug`. The program arrives already fetched via `programResolver`
 * (an unknown slug never reaches this page); `null` means the registry could
 * not be reached, shown as an unavailable state.
 */
export class ProgramDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly program: Program | null = this.route.snapshot.data['program'] ?? null;

  ngOnInit(): void {
    if (!this.program) {
      this.seo.update({
        title: 'Program unavailable',
        description: 'This program is temporarily unavailable.',
        noIndex: true,
      });
      return;
    }

    this.seo.update({
      title: this.program.title,
      description: this.program.subtitle,
    });
  }
}
