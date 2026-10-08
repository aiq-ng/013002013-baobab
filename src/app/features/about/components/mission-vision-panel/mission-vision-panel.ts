import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';

/** Two-tone "Our Mission" / "Our Vision" panel. */
@Component({
  selector: 'app-mission-vision-panel',
  standalone: true,
  imports: [StaggerRevealDirective],
  templateUrl: './mission-vision-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionVisionPanel {}
