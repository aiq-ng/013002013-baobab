import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type StatCardVariant = 'on-light' | 'on-dark';

/** Big-number stat pattern used in the hero strip and the impact-stats row. */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  @Input({ required: true }) value = '';
  @Input() unit = '';
  @Input({ required: true }) label = '';
  @Input() variant: StatCardVariant = 'on-light';

  get containerClass(): string {
    return this.variant === 'on-dark' ? 'text-white' : 'text-ink-950';
  }
}
