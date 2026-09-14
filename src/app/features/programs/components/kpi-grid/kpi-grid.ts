import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProgramStat } from '../../models/program';

const ICON_KEYS = ['systems', 'pacts', 'security', 'flow'] as const;

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

  iconKey(index: number): (typeof ICON_KEYS)[number] {
    return ICON_KEYS[index % ICON_KEYS.length];
  }

  label(kpi: ProgramStat, index: number): string {
    return kpi.label?.trim() || `Metric ${index + 1}`;
  }
}
