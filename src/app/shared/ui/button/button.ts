import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../../core/services/analytics.service';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'light'
  | 'light-accent'
  | 'mint'
  | 'outline-light'
  | 'console'
  | 'console-soft'
  | 'danger';
export type ButtonSize = 'md' | 'lg';

/**
 * Shared CTA button. Renders as a real routed anchor when `routerLink` is set,
 * otherwise as a native <button>. Either form emits `pressed` on click — never a dead link.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.block]': 'fullWidth',
    '[class.w-full]': 'fullWidth',
  },
})
export class Button {
  @Input({ required: true }) label = '';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() fullWidth = false;
  @Input() routerLink: string | null = null;
  /** Plain (non-routed) destination — a document URL or external link. */
  @Input() href: string | null = null;
  /** Adds the `download` attribute to an `href` anchor. */
  @Input() download = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  /** An action is in flight: disables, sets `aria-busy`, shows a spinner and `busyLabel`. */
  @Input() busy = false;
  @Input() busyLabel: string | null = null;
  /** When set, every click (routed or plain) is reported via AnalyticsService.trackCtaClick. */
  @Input() ctaId: string | null = null;

  @Output() readonly pressed = new EventEmitter<void>();

  private readonly analyticsService = inject(AnalyticsService);

  readonly baseClass =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-premium hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0';

  get sizeClass(): string {
    const padding = this.size === 'lg' ? 'px-8 py-4 text-base font-semibold' : 'px-6 py-3 text-sm';
    return this.fullWidth ? `${padding} w-full` : padding;
  }

  get variantClass(): string {
    if (this.variant === 'primary') {
      return 'bg-brand-600 text-white hover:bg-brand-700';
    }
    // Console colours live in styles.css recipes so plain <button>s share them exactly.
    if (this.variant === 'console') {
      return 'console-btn--primary';
    }
    if (this.variant === 'console-soft') {
      return 'console-btn--soft';
    }
    if (this.variant === 'danger') {
      return 'console-btn--danger';
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

  get inactive(): boolean {
    return this.disabled || this.busy;
  }

  get displayLabel(): string {
    return this.busy && this.busyLabel ? this.busyLabel : this.label;
  }

  onClick(): void {
    if (!this.inactive) {
      this.trackClick();
      this.pressed.emit();
    }
  }

  onRoutedClick(): void {
    this.trackClick();
    this.pressed.emit();
  }

  private trackClick(): void {
    if (this.ctaId) {
      this.analyticsService.trackCtaClick(this.ctaId);
    }
  }
}
