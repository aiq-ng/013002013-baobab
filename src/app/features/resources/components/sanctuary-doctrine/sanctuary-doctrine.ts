import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClassifiedAccessForm } from '../classified-access-form/classified-access-form';

/**
 * "The Neutral Sovereign Sanctuary Doctrine": doctrine explainer text next to
 * the restricted Track 1.5 classified-access gate form.
 */
@Component({
  selector: 'app-sanctuary-doctrine',
  standalone: true,
  imports: [ClassifiedAccessForm],
  templateUrl: './sanctuary-doctrine.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanctuaryDoctrine {}
