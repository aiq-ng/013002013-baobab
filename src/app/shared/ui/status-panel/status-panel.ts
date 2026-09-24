import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Empty and error states for console lists. An error is an alert with a
 * retry, never a silent blank table; an empty state points to the next
 * action instead of a dead end.
 */
@Component({
  selector: 'app-status-panel',
  standalone: true,
  templateUrl: './status-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusPanel {
  readonly variant = input<'empty' | 'error'>('empty');
  readonly title = input.required<string>();
  readonly message = input('');
  readonly actionLabel = input<string | null>(null);
  readonly action = output<void>();
}
