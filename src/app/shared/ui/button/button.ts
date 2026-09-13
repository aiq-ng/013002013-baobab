import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary';

/**
 * Shared CTA button. Renders as a real routed anchor when `routerLink` is set,
 * otherwise as a native <button> that emits `pressed` on click — never a dead link.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  @Input({ required: true }) label = '';
  @Input() variant: ButtonVariant = 'primary';
  @Input() routerLink: string | null = null;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;

  @Output() readonly pressed = new EventEmitter<void>();

  readonly baseClass =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50';

  get variantClass(): string {
    return this.variant === 'primary'
      ? 'bg-brand-600 text-white hover:bg-brand-700'
      : 'border border-current bg-transparent text-brand-700 hover:bg-brand-50';
  }

  onClick(): void {
    if (!this.disabled) {
      this.pressed.emit();
    }
  }
}
