import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

const AUTO_DISMISS_MS = 5_000;

/**
 * Service-driven toast queue (plan §8d), mirroring `SuccessModalService`:
 * any console page can push a toast without owning where it renders. The
 * container is mounted once, in `ConsoleLayout`.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private nextId = 0;

  private push(message: string, variant: ToastVariant): void {
    const id = this.nextId++;
    this._toasts.update((toasts) => [...toasts, { id, message, variant }]);
    setTimeout(() => this.dismiss(id), AUTO_DISMISS_MS);
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
