import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * One entry in a repeatable list (KPI, stat, paragraph, pillar, milestone):
 * a labelled group with a numbered heading, an optional one-line summary,
 * and a remove button named after the item. Every list in the console
 * edits the same way, so there's only one pattern to learn.
 */
@Component({
  selector: 'app-console-repeat-item',
  standalone: true,
  templateUrl: './repeat-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class RepeatItem {
  readonly headingId = input.required<string>();
  readonly title = input.required<string>();
  readonly summary = input('');
  readonly canRemove = input(true);
  readonly remove = output<void>();
}
