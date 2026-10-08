import { ChangeDetectionStrategy, Component } from '@angular/core';

export interface PartnershipFeature {
  icon: string;
  title: string;
  description: string;
}

const FEATURES: PartnershipFeature[] = [
  {
    icon: 'clipboard-check',
    title: 'Governments and regional bodies',
    description: 'Governments and Local Authorities, ECOWAS, AES and AU.',
  },
  {
    icon: 'gavel',
    title: 'Communities and institutions',
    description:
      'Traditional and Religious Institutions, and Civil Society and Community Organizations.',
  },
  {
    icon: 'palm-tree',
    title: 'International partners and donors',
    description: 'UN Agencies and International Partners, and Development Partners and Donors.',
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
