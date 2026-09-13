import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TheaterMap, TheaterEntry } from '../../../../shared/theater-map/theater-map';

/**
 * Interactive theater map section. This will eventually render an actual map
 * (not a filtered card grid), so it carries no theater data yet — just the
 * shared `app-theater-map` in its data-unavailable state until that's built.
 */
@Component({
  selector: 'app-programs-theater-section',
  standalone: true,
  imports: [TheaterMap],
  templateUrl: './theater-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsTheaterSection {
  readonly theaters: TheaterEntry[] = [];
}
