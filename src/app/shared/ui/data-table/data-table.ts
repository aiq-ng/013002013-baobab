import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableSkeleton } from '../table-skeleton/table-skeleton';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => string;
  /** Render the cell as a status pill in this tone. */
  tone?: (row: T) => BadgeTone | null;
  /** Hide below the `md` breakpoint to keep phone tables readable. */
  hideOnMobile?: boolean;
}

/**
 * Generic list table for the console (plan §8d): signal inputs for columns
 * and rows, a row-click output, and a horizontal-scroll wrapper so a wide
 * table never breaks mobile layout.
 *
 * Rows keep native table semantics (a `role="button"` row would hide every
 * cell from a screen reader's table navigation); keyboard and assistive-tech
 * users get a real, labelled button in the first cell instead, and the
 * whole row stays clickable for pointer users.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [TableSkeleton],
  templateUrl: './data-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T> {
  readonly columns = input.required<DataTableColumn<T>[]>();
  readonly rows = input.required<T[]>();
  readonly rowKey = input<(row: T) => string>((row) => JSON.stringify(row));
  /** Accessible name for each row's open button, e.g. "Open submission R-1". */
  readonly rowLabel = input<(row: T) => string>(() => 'Open');
  readonly emptyMessage = input('No results.');
  /** Names the table and its scroll region for assistive tech. */
  readonly caption = input('Results');
  readonly loading = input(false);

  readonly rowActivated = output<T>();

  activate(row: T): void {
    this.rowActivated.emit(row);
  }

  onButtonClick(event: Event, row: T): void {
    event.stopPropagation();
    this.activate(row);
  }
}
