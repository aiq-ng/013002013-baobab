import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';

interface HeroStat {
  value: string;
  unit: string;
  label: string;
}

/** Home hero: full-bleed baobab image, headline, subtext, 4 live stat counters. */
@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [StatCard, NgOptimizedImage],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  readonly stats: HeroStat[] = [
    { value: '14,280', unit: 'KM', label: 'SECURED TRANSIT CORRIDORS' },
    { value: '184', unit: 'PACTS', label: 'CUSTOMARY ACCORDS' },
    { value: '-64%', unit: '', label: 'CIVILIAN DE-ESCALATION' },
    { value: '9', unit: 'STATES', label: 'SOVEREIGN MANDATES' },
  ];
}
