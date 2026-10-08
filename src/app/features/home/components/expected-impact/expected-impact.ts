import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';

export type ImpactIcon = 'handshake' | 'cycle';

interface ImpactOutcome {
  number: string;
  label: string;
  icon: ImpactIcon;
}

/** "Expected impact" — the six numbered outcomes Baobab's work aims for. */
@Component({
  selector: 'app-expected-impact',
  standalone: true,
  imports: [StaggerRevealDirective, Eyebrow],
  templateUrl: './expected-impact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpectedImpact {
  readonly outcomes: ImpactOutcome[] = [
    { number: '01', label: 'Reduced violence and improved community security', icon: 'handshake' },
    { number: '02', label: 'Stronger trust between states and communities', icon: 'cycle' },
    { number: '03', label: 'Improved governance and social inclusion', icon: 'cycle' },
    { number: '04', label: 'Humanitarian access and protection of civilians.', icon: 'handshake' },
    { number: '05', label: 'Pathways for disengagement and reintegration.', icon: 'handshake' },
    { number: '06', label: 'A more cohesive and stable West Africa.', icon: 'handshake' },
  ];
}
