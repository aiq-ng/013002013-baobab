import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Drawer } from '../../../../shared/ui/drawer/drawer';
import { AdminEngagement, SubmissionStatus } from '../../models/admin';

const STATUS_OPTIONS: SubmissionStatus[] = ['new', 'read', 'actioned', 'spam'];

/** Submission detail drawer with status-change actions (plan §8b component list). */
@Component({
  selector: 'app-detail-drawer',
  standalone: true,
  imports: [Drawer],
  templateUrl: './detail-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailDrawer {
  readonly submission = input<AdminEngagement | null>(null);
  readonly statusChanged = output<SubmissionStatus>();
  readonly closed = output<void>();

  readonly statusOptions = STATUS_OPTIONS;

  dismiss(): void {
    this.closed.emit();
  }

  setStatus(status: SubmissionStatus): void {
    this.statusChanged.emit(status);
  }
}
