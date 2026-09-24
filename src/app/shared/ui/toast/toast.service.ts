import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

const SUCCESS_DISMISS_MS = 5_000;

/**
 * Service-driven toast queue (plan §8d), mirroring `SuccessModalService`:
 * any console page can push a toast without owning where it renders. The
 * container is mounted once, in `ConsoleLayout`.
 *
 * Successes fade on their own; errors stay until dismissed, because a
 * failure the editor never saw is a failure they'll never retry (WCAG 2.2.1
 * — no time limit on reading something that matters). A message already on
 * screen isn't stacked again.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private nextId = 0;

  private push(message: string, variant: ToastVariant): void {
    if (this._toasts().some((t) => t.message === message && t.variant === variant)) {
      return;
    }
    const id = this.nextId++;
    this._toasts.update((toasts) => [...toasts, { id, message, variant }]);
    if (variant === 'success') {
      setTimeout(() => this.dismiss(id), SUCCESS_DISMISS_MS);
    }
  }

  success(message: string): void {
    this.push(message, 'success');
  }

  error(message: string): void {
    this.push(message, 'error');
  }

  dismiss(id: number): void {
    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
