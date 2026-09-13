import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '../../../../shared/ui/badge/badge';

interface CycleStep {
  step: number;
  title: string;
  description: string;
}

/** 4-step "Integrated Conciliation Cycle" feedback loop. */
@Component({
  selector: 'app-conciliation-cycle',
  standalone: true,
  imports: [Badge],
  templateUrl: './conciliation-cycle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliationCycle {
  readonly steps: CycleStep[] = [
    {
      step: 1,
      title: 'Customary Inquest',
      description: 'Grievance listening circles mediated under sacred communal jurisprudence.',
    },
    {
      step: 2,
      title: 'Track 1.5 Drafting',
      description:
        'Transformation of customary oaths into actionable sovereign security protocols.',
    },
    {
      step: 3,
      title: 'Ministerial Clearance',
      description: 'Confidential state ratification guaranteeing demilitarized buffer zones.',
    },
    {
      step: 4,
      title: 'Sovereign Stabilization',
      description: 'Long-term transhumance monitoring maintained by Joint Liaison Desks.',
    },
  ];
}
