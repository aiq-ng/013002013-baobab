import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Modal } from '../modal/modal';
import { Button } from '../button/button';
import { ConfirmService } from './confirm.service';

/**
 * Renders `ConfirmService` requests as an `alertdialog`. Mount once per
 * layout. For destructive requests the safe choice (cancel) takes initial
 * focus and the confirm button is styled as danger, so the dangerous path
 * always takes a deliberate move.
 */
@Component({
  selector: 'app-confirm-dialog-host',
  standalone: true,
  imports: [Modal, Button],
  templateUrl: './confirm-dialog-host.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogHost {
  private readonly service = inject(ConfirmService);
  readonly pending = this.service.pending;

  answer(value: boolean): void {
    this.service.resolve(value);
  }
}
