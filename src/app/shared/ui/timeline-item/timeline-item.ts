import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Dated accord-milestone timeline row, with a connecting line to the next item. */
@Component({
  selector: 'app-timeline-item',
  standalone: true,
  templateUrl: './timeline-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineItem {
  @Input({ required: true }) date = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
  @Input() isLast = false;
}
