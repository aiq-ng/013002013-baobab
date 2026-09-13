import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Two-tone "Our Mission" / "Our Vision" panel. */
@Component({
  selector: 'app-mission-vision-panel',
  standalone: true,
  templateUrl: './mission-vision-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionVisionPanel {}
