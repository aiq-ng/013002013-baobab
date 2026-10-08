import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Program detail header: "Programs › title" breadcrumb, h1, and the program summary. */
@Component({
  selector: 'app-program-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './program-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramHeader {
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
}
