import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramBreadcrumb } from './components/breadcrumb/breadcrumb';
import { KpiGrid } from './components/kpi-grid/kpi-grid';
import { DoctrineSection } from './components/doctrine-section/doctrine-section';
import { OperationalPillars } from './components/operational-pillars/operational-pillars';
import { AccordTimeline } from './components/accord-timeline/accord-timeline';
import { DispatchForm } from '../../shared/ui/dispatch-form/dispatch-form';
import { SeoService } from '../../core/services/seo.service';
import { findProgramBySlug } from './data/programs.data';
import { Program } from './models/program';

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
  ],
  templateUrl: './program-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  readonly program: Program | undefined = findProgramBySlug(
    this.route.snapshot.paramMap.get('slug'),
  );

  ngOnInit(): void {
    if (!this.program) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.seo.update({
      title: this.program.title,
      description: this.program.subtitle,
    });
  }
}
