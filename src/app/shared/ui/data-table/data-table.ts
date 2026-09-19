import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => string;
}

/**
 * Generic list table for the console's three screens (plan §8d): signal
 * inputs for columns and rows, a row-click output, keyboard row activation
 * (Enter/Space, since a table row isn't natively focusable or actionable),
 * and a horizontal-scroll wrapper so a wide table never breaks mobile layout.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T> {
  readonly columns = input.required<DataTableColumn<T>[]>();
  readonly rows = input.required<T[]>();
  readonly rowKey = input<(row: T) => string>((row) => JSON.stringify(row));
  readonly emptyMessage = input('No results.');

  readonly rowActivated = output<T>();

  activate(row: T): void {
    this.rowActivated.emit(row);
  }

  onRowKeydown(event: KeyboardEvent, row: T): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.activate(row);
    }
  }
}
