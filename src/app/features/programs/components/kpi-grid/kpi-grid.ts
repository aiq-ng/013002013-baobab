import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProgramStat } from '../../models/program';

/** 4-item KPI stat card row shown near the top of a program detail page. */
@Component({
  selector: 'app-kpi-grid',
  standalone: true,
  templateUrl: './kpi-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiGrid {
  @Input({ required: true }) kpis: ProgramStat[] = [];

  cardClass(index: number): string {
    return index % 2 === 0 ? 'bg-brand-700' : 'bg-ink-950';
  }
}
