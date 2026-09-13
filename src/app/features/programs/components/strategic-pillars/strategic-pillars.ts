import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';

export interface StrategicPillar {
  code: string;
  icon: string;
  title: string;
  description: string;
}

const PILLARS: StrategicPillar[] = [
  {
    code: 'PILLAR 01',
    icon: '🔄',
    title: 'Transhumance Corridors',
    description:
      'Demilitarizing seasonal pastoral axes, GPS-mapping shared borehole coordinates, and securing transit corridors across contested savannah grazing lines.',
  },
  {
    code: 'PILLAR 02',
    icon: '⚖️',
    title: 'Customary Jurisprudence',
    description:
      'Revitalizing customary truth circles, traditional chieftaincy pacts, and sultanate mediation tribunals to formalize local restitution treaties.',
  },
  {
    code: 'PILLAR 03',
    icon: '🛡️',
    title: 'Restorative Security',
    description:
      'Grassroots civilian vetting panels, demobilization registries, and community-based civic re-entry frameworks for ex-combatant integration.',
  },
  {
    code: 'PILLAR 04',
    icon: '🤝',
    title: 'Cross-Border Security',
    description:
      'Interlinking provincial state governors directly with sovereign customary councils to eliminate statutory jurisdiction vacuums along remote border tracts.',
  },
];

/** "The Four Strategic Pillars" section — coherent operational doctrine grid. */
@Component({
  selector: 'app-strategic-pillars',
  standalone: true,
  imports: [Eyebrow],
  templateUrl: './strategic-pillars.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategicPillars {
  readonly pillars = PILLARS;
}
