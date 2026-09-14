import { ChangeDetectionStrategy, Component } from '@angular/core';

export interface PartnershipFeature {
  icon: string;
  title: string;
  description: string;
  linkLabel: string;
}

const FEATURES: PartnershipFeature[] = [
  {
    icon: 'clipboard-check',
    title: 'Multilateral Missions',
    description:
      'Harmonizing African Union (AU), ECOWAS, and UN Peacebuilding frameworks under shared regional treaty doctrines.',
    linkLabel: 'Tier 1 Interoperability',
  },
  {
    icon: 'gavel',
    title: 'Customary Legitimacy',
    description:
      'Direct accords ratified across 480+ traditional emirates, sultanates, and village benches with binding local authority.',
    linkLabel: 'Ancestral Jurisprudence',
  },
  {
    icon: 'palm-tree',
    title: 'Zero Kinetic Escalation',
    description:
      '100% mediation and demilitarized transhumance corridors negotiated and secured without sovereign force.',
    linkLabel: 'Sahelian Corridors',
  },
];

/** Three feature cards under the Partnerships hero, per the "PARTNERSHIPS 1" export. */
@Component({
  selector: 'app-partnerships-feature-cards',
  standalone: true,
  templateUrl: './feature-cards.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnershipsFeatureCards {
  readonly features = FEATURES;
}
