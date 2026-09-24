import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Shared toggle-pill filter row (treaties archive, operational theater map).
 * Keeps one pill treatment, one `aria-pressed` contract, and one focus ring
 * everywhere a list is filtered by category.
 */
@Component({
  selector: 'app-filter-pills',
  standalone: true,
  templateUrl: './filter-pills.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPills {
  @Input({ required: true }) pills: string[] = [];
  @Input({ required: true }) active = '';
  @Input({ required: true }) ariaLabel = '';

  @Output() readonly activeChange = new EventEmitter<string>();

  readonly baseClass =
    'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ease-premium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600';

  pillClass(pill: string): string {
    return pill === this.active
      ? `${this.baseClass} border-brand-600 bg-brand-600 text-white shadow-sm`
      : `${this.baseClass} border-ink-950/15 bg-surface text-ink-950/70 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700`;
  }

  select(pill: string): void {
    this.activeChange.emit(pill);
  }
}
