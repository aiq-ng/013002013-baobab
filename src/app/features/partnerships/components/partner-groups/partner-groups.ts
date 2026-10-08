import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';

export interface PartnerGroup {
  icon: 'government' | 'crown' | 'globe' | 'agency' | 'community';
  label: string;
}

const PARTNER_GROUPS: PartnerGroup[] = [
  { icon: 'government', label: 'Governments and Local Authorities' },
  { icon: 'crown', label: 'Traditional and Religious Institutions' },
  { icon: 'globe', label: 'ECOWAS, AES and AU' },
  { icon: 'agency', label: 'Agencies and International Partners' },
  { icon: 'community', label: 'Civil Society and Community Organizations' },
];

/**
 * "Our Partners" icon + label strip, per the "PARTNERSHIPS 1" export. Icons are
 * Hugeicons (free, stroke-rounded) paths inlined to avoid a runtime dependency.
 */
@Component({
  selector: 'app-partnerships-partner-groups',
  standalone: true,
  imports: [StaggerRevealDirective],
  templateUrl: './partner-groups.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnershipsPartnerGroups {
  readonly groups = PARTNER_GROUPS;
}
