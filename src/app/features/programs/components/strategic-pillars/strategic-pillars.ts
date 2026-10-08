import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface StrategicPillar {
  code: string;
  icon: string;
  title: string;
  description: string;
}

const PILLARS: StrategicPillar[] = [
  {
    code: 'PRINCIPLE 01',
    icon: 'compass',
    title: 'State primacy',
    description: 'We support, not replace, state authority.',
  },
  {
    code: 'PRINCIPLE 02',
    icon: 'gavel',
    title: 'Community ownership',
    description: 'Communities lead, solutions are locally owned.',
  },
  {
    code: 'PRINCIPLE 03',
    icon: 'shield',
    title: 'Hybrid mediation',
    description: 'Traditional systems, religious jurisprudence and modern practice together.',
  },
  {
    code: 'PRINCIPLE 04',
    icon: 'handshake',
    title: 'Regional harmonization',
    description: 'Bridging ECOWAS and AES through shared learning.',
  },
];

/** "Four principles" section — how The Baobab Group works. */
@Component({
  selector: 'app-strategic-pillars',
  standalone: true,
  templateUrl: './strategic-pillars.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategicPillars {
  /** Program detail pages show just the cards, under the program header. */
  @Input() showHeading = true;
  readonly pillars = PILLARS;
}
