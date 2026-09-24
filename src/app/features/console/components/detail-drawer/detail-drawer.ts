import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Drawer } from '../../../../shared/ui/drawer/drawer';
import { AdminEngagement, SubmissionStatus } from '../../models/admin';
import { formatDateTime, humanize } from '../../utils/format';

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
  /** A status change is in flight — the status buttons lock until it settles. */
  readonly busy = input(false);
  readonly statusChanged = output<SubmissionStatus>();
  readonly closed = output<void>();

  readonly statusOptions = STATUS_OPTIONS;
  readonly formatDateTime = formatDateTime;
  readonly humanize = humanize;

  dismiss(): void {
    this.closed.emit();
  }

  setStatus(status: SubmissionStatus): void {
    if (!this.busy() && this.submission()?.status !== status) {
      this.statusChanged.emit(status);
    }
  }

  mailto(submission: AdminEngagement): string {
    const subject = encodeURIComponent(`Re: ${submission.referenceId}`);
    return `mailto:${encodeURIComponent(submission.email)}?subject=${subject}`;
  }
}
