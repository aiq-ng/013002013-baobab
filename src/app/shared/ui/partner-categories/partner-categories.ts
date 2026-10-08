import { ChangeDetectionStrategy, Component } from '@angular/core';

export type PartnerCategoryIcon = 'government' | 'traditional' | 'regional' | 'agency' | 'civil';

interface PartnerCategory {
  label: string;
  icon: PartnerCategoryIcon;
}

/** "Our Partners" — the five partner constituencies Baobab works with. */
@Component({
  selector: 'app-partner-categories',
  standalone: true,
  templateUrl: './partner-categories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerCategories {
  readonly categories: PartnerCategory[] = [
    { label: 'Governments and Local Authorities', icon: 'government' },
    { label: 'Traditional and Religious Institutions', icon: 'traditional' },
    { label: 'ECOWAS, AES and AU', icon: 'regional' },
    { label: 'Agencies and International Partners', icon: 'agency' },
    { label: 'Civil Society and Community Organizations', icon: 'civil' },
  ];
}
