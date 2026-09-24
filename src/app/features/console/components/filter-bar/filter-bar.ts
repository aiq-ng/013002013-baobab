import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface FilterOption {
  value: string;
  label: string;
}

/** Source/status filter pills for the submissions list (plan §8b component list). */
@Component({
  selector: 'app-filter-bar',
  standalone: true,
  templateUrl: './filter-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBar {
  readonly options = input.required<FilterOption[]>();
  readonly active = input<string | null>(null);
  readonly label = input('Filter');

  readonly selected = output<string | null>();

  select(value: string | null): void {
    this.selected.emit(value);
  }
}
