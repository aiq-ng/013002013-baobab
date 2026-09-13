import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProgramPillar } from '../../models/program';

/** "Codified Operational Pillars" — 3-column governance architecture section. */
@Component({
  selector: 'app-operational-pillars',
  standalone: true,
  templateUrl: './operational-pillars.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationalPillars {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) heading = '';
  @Input({ required: true }) description = '';
  @Input({ required: true }) pillars: ProgramPillar[] = [];
}
