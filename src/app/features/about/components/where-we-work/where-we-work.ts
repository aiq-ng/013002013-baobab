import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FilterPills } from '../../../../shared/ui/filter-pills/filter-pills';
import { CtaBand } from '../../../../shared/ui/cta-band/cta-band';

interface Region {
  label: string;
  heading: string;
  body: string;
}

const REGIONS: Region[] = [
  {
    label: 'Where we work',
    heading: 'We work across ECOWAS and AES countries.',
    body: 'West Africa faces a complex security environment: the rise of violent extremist organizations, political fragmentation between ECOWAS and the Alliance of Sahel States (AES), socio-economic grievances and weak governance. Military responses are necessary but not sufficient.',
  },
  {
    label: 'ECOWAS member states',
    heading: 'ECOWAS member states',
    body: 'Benin, Cabo Verde, Côte d’Ivoire, The Gambia, Ghana, Guinea, Guinea-Bissau, Liberia, Nigeria, Senegal, Sierra Leone and Togo.',
  },
  {
    label: 'Alliance of Sahel States (AES)',
    heading: 'Alliance of Sahel States (AES)',
    body: 'Burkina Faso, Mali and Niger.',
  },
  {
    // Not specified in the design export — placeholder copy pending the client's country list.
    label: 'Other states',
    heading: 'Other states',
    body: 'We also engage neighbouring states whose stability is linked to West Africa’s. Contact us to discuss engagement beyond ECOWAS and AES.',
  },
];

/** "Where we work" — region pills that swap the copy of the closing partner CTA band. */
@Component({
  selector: 'app-where-we-work',
  standalone: true,
  imports: [FilterPills, CtaBand],
  templateUrl: './where-we-work.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhereWeWork {
  readonly regions = REGIONS;
  readonly labels = REGIONS.map((r) => r.label);
  readonly activeLabel = signal(REGIONS[0].label);
  readonly active = computed(
    () => this.regions.find((r) => r.label === this.activeLabel()) ?? this.regions[0],
  );
}
