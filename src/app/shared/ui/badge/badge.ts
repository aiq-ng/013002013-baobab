import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BadgeVariant = 'default' | 'accent-on-dark';

/** Small eyebrow/status pill label, e.g. "KNOW ABOUT US", "TRACK 1 • THE BAOBAB PIVOT". */
@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
  @Input({ required: true }) text = '';
  @Input() variant: BadgeVariant = 'default';

  get variantClass(): string {
    return this.variant === 'accent-on-dark'
      ? 'bg-brand-800 text-brand-100'
      : 'bg-brand-100 text-brand-700';
  }
}
