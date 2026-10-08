import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';

type ValueIcon = 'africa' | 'handshake' | 'bridge' | 'baobab' | 'badge';

interface CoreValue {
  text: string;
  icon: ValueIcon;
  tone: 'gold' | 'green';
}

/** "Our values" — five core values with alternating gold/green icon tiles. */
@Component({
  selector: 'app-core-values',
  standalone: true,
  imports: [StaggerRevealDirective, Eyebrow],
  templateUrl: './core-values.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreValues {
  // Order follows the export's reading order: left column top-to-bottom, then right column.
  readonly values: CoreValue[] = [
    { text: 'African-led, driven by local realities and solutions.', icon: 'africa', tone: 'gold' },
    { text: 'Trusted by communities, respected by governments.', icon: 'handshake', tone: 'green' },
    { text: 'Bridges ECOWAS and AES divides.', icon: 'bridge', tone: 'gold' },
    {
      text: 'Combines traditional wisdom, religious legitimacy and modern expertise.',
      icon: 'baobab',
      tone: 'green',
    },
    // The export reads "lexible" — a dropped "F", corrected here.
    { text: 'Flexible, confidential and results-oriented.', icon: 'badge', tone: 'gold' },
  ];
}
