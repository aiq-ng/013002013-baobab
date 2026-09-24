import { Injectable, signal } from '@angular/core';

export type ConfirmTone = 'default' | 'danger';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
}

export type PendingConfirm = Required<ConfirmRequest>;

/**
 * One promise-based confirmation dialog for the whole console (destructive
 * deletes, discarding unsaved edits). Rendered once by `ConfirmDialogHost`
 * in the console layout, so every caller gets the same accessible dialog
 * and a route guard can `await` it.
 */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly _pending = signal<PendingConfirm | null>(null);
  readonly pending = this._pending.asReadonly();
  private resolver: ((answer: boolean) => void) | null = null;

  ask(request: ConfirmRequest): Promise<boolean> {
    this.resolve(false);
    this._pending.set({
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      tone: 'default',
      ...request,
    });
    return new Promise<boolean>((resolve) => (this.resolver = resolve));
  }

  resolve(answer: boolean): void {
    const resolver = this.resolver;
    this.resolver = null;
    this._pending.set(null);
    resolver?.(answer);
  }
}
