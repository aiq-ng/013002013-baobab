import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * The top of every console page — optional back link, eyebrow, the page's
 * single `<h1>`, a meta line, and projected `[actions]` — so all screens
 * share one heading hierarchy and rhythm (design/admin/PROGRAMS MAIN.png).
 */
@Component({
  selector: 'app-console-page-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly eyebrow = input('');
  readonly meta = input('');
  readonly backLink = input<string | null>(null);
  readonly backLabel = input('Back');
}
