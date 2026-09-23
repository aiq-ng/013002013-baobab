import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AddendumDispatchForm } from '../addendum-dispatch-form/addendum-dispatch-form';
import { Button } from '../../../../shared/ui/button/button';

/**
 * Two-panel band: the "Annual Statecraft Review" featured document card
 * (left) and the Sovereign Addendum Dispatch email-capture card plus its
 * document metadata grid (right).
 */
@Component({
  selector: 'app-resource-highlight',
  standalone: true,
  imports: [AddendumDispatchForm, Button],
  templateUrl: './resource-highlight.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceHighlight {
  readonly chapters = [
    'Ch. I: Sultanate Water Rights',
    'Ch. II: Tri-Border Dry-Season Corridors',
    'Ch. III: Non-Kinetic Reintegration',
    'Ch. IV: Customary Evidence Binding',
  ];

  readonly metadata = [
    { label: 'Diplomatic Classification', value: 'Unrestricted Track 1.5', accent: true },
    { label: 'Signatory States Referenced', value: '14 West African Nations', accent: false },
    { label: 'Custodial Depository', value: 'Dakar High Tribunal Archive', accent: false },
    { label: 'Jurisprudential Status', value: 'Customary-State Concurrence', accent: true },
  ];
}
