import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary' | 'light' | 'light-accent' | 'mint' | 'outline-light';

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
    if (this.variant === 'primary') {
      return 'bg-brand-600 text-white hover:bg-brand-700';
    }
    if (this.variant === 'light') {
      return 'bg-white text-ink-950 shadow-sm hover:bg-slate-50';
    }
    if (this.variant === 'light-accent') {
      return 'bg-white text-brand-700 shadow-sm hover:bg-brand-50';
    }
    if (this.variant === 'mint') {
      return 'bg-brand-100 text-brand-900 hover:bg-brand-200';
    }
    if (this.variant === 'outline-light') {
      return 'border border-white/70 bg-transparent text-white hover:bg-white/10';
    }
    return 'border border-current bg-transparent text-brand-700 hover:bg-brand-50';
  }

  onClick(): void {
    if (!this.disabled) {
      this.pressed.emit();
    }
  }
}
