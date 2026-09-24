import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../../shared/ui/drawer/drawer';
import { Button } from '../../../../shared/ui/button/button';
import { AdminAccessRequest } from '../../models/admin';
import { formatDateTime } from '../../utils/format';

export interface Decision {
  approve: boolean;
  note: string;
}

export const NOTE_MAX_LENGTH = 1000;

/** Approve/deny panel for a Track 1.5 access request (plan §8b component list). */
@Component({
  selector: 'app-decision-panel',
  standalone: true,
  imports: [Drawer, Button, FormsModule],
  templateUrl: './decision-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecisionPanel {
  readonly request = input<AdminAccessRequest | null>(null);
  /** Which decision is being recorded, if any — both buttons lock meanwhile. */
  readonly deciding = input<'approve' | 'deny' | null>(null);
  readonly decided = output<Decision>();
  readonly closed = output<void>();

  readonly note = signal('');
  readonly noteMax = NOTE_MAX_LENGTH;
  readonly formatDateTime = formatDateTime;

  dismiss(): void {
    if (this.deciding()) return;
    this.note.set('');
    this.closed.emit();
  }

  decide(approve: boolean): void {
    if (this.deciding()) return;
    this.decided.emit({ approve, note: this.note().trim().slice(0, NOTE_MAX_LENGTH) });
  }

  /** Called by the page once the decision is recorded. */
  reset(): void {
    this.note.set('');
  }
}
