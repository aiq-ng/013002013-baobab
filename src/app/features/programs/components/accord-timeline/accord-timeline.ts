import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TimelineItem } from '../../../../shared/ui/timeline-item/timeline-item';
import { ProgramMilestone } from '../../models/program';

/** "Verified Accord Milestones & Field Chronicle" — dated milestone timeline. */
@Component({
  selector: 'app-accord-timeline',
  standalone: true,
  imports: [TimelineItem],
  templateUrl: './accord-timeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordTimeline {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) heading = '';
  @Input({ required: true }) description = '';
  @Input({ required: true }) milestones: ProgramMilestone[] = [];
}
