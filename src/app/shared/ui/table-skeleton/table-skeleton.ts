import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Placeholder rows shown while a console list loads — keeps layout stable
 * and tells screen readers what's happening via a polite status region. */
@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  templateUrl: './table-skeleton.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSkeleton {
  readonly rows = input(5);
  readonly label = input('Loading…');
  readonly placeholders = computed(() => Array.from({ length: this.rows() }, (_, i) => i));
}
