import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

/** `aria-live="polite"` region (plan §8d) so a toast is announced without
 * stealing focus — mount once per app/layout, never per page. */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  templateUrl: './toast-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
