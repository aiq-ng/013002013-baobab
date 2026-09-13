import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ImpactStat {
  value: string;
  label: string;
  description: string;
  valueClass: string;
  labelClass: string;
}

/** Impact stats row beneath the operational theater previews. */
@Component({
  selector: 'app-impact-stats',
  standalone: true,
  templateUrl: './impact-stats.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImpactStats {
  readonly stats: ImpactStat[] = [
    {
      value: '1.4k+',
      label: 'Grassroots Pacts Mediated',
      description: 'Enforced under customary jurisprudence',
      valueClass: 'text-ink-950',
      labelClass: 'text-brand-700',
    },
    {
      value: '100%',
      label: 'Non-Kinetic Doctrine',
      description: 'Zero lethal engagements deployed',
      valueClass: 'text-ink-950',
      labelClass: 'text-brand-700',
    },
    {
      value: '480',
      label: 'Traditional Authorities',
      description: 'Paramount sultans, lamidos, and emirs',
      valueClass: 'text-ink-950',
      labelClass: 'text-amber-700',
    },
    {
      value: '14',
      label: 'Sovereign Nations',
      description: 'Signatory liaison memorandums',
      valueClass: 'text-ink-950',
      labelClass: 'text-ink-950',
    },
  ];
}
