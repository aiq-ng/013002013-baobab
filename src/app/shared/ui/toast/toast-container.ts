import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ToastService } from './toast.service';

/** Two live regions (plan §8d) so a toast is announced without stealing
 * focus: errors assertively, successes politely. Mount once per layout,
 * never per page — the regions must exist before content is injected. */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './toast-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainer {
  private readonly toastService = inject(ToastService);
  readonly errors = computed(() => this.toastService.toasts().filter((t) => t.variant === 'error'));
  readonly successes = computed(() =>
    this.toastService.toasts().filter((t) => t.variant === 'success'),
  );

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
