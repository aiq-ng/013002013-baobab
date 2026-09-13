import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

export interface ProgramsHeroStat {
  value: string;
  label: string;
  sublabel: string;
}

const DEFAULT_STATS: ProgramsHeroStat[] = [
  {
    value: '14,280 KM',
    label: 'SECURED TRANSIT CORRIDORS',
    sublabel: 'Bi-annual transhumance axes pacified',
  },
  { value: '184', label: 'CUSTOMARY ACCORDS', sublabel: 'Ratified by traditional village elders' },
  {
    value: '-64%',
    label: 'CIVILIAN DE-ESCALATION',
    sublabel: 'Drop in seasonal pastoral flashpoints',
  },
  { value: '9', label: 'SOVEREIGN MANDATES', sublabel: 'Sahel rim & ECOWAS perimeter' },
];

/** Programs listing hero: full-bleed photo, headline, subtext, and a 4-stat strip. */
@Component({
  selector: 'app-programs-hero',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsHero {
  @Input() stats: ProgramsHeroStat[] = DEFAULT_STATS;
}
