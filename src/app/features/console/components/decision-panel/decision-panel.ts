import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Drawer } from '../../../../shared/ui/drawer/drawer';
import { Button } from '../../../../shared/ui/button/button';
import { AdminAccessRequest } from '../../models/admin';

export interface Decision {
  approve: boolean;
  note: string;
}

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
  readonly decided = output<Decision>();
  readonly closed = output<void>();

  readonly note = signal('');

  dismiss(): void {
    this.note.set('');
    this.closed.emit();
  }

  decide(approve: boolean): void {
    this.decided.emit({ approve, note: this.note() });
    this.note.set('');
  }
}
