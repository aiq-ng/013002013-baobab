import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHeading } from '../../../../shared/ui/section-heading/section-heading';
import { ClassifiedAccessForm } from '../classified-access-form/classified-access-form';

/**
 * "The Neutral Sovereign Sanctuary Doctrine": doctrine explainer text next to
 * the restricted Track 1.5 classified-access gate form.
 */
@Component({
  selector: 'app-sanctuary-doctrine',
  standalone: true,
  imports: [ClassifiedAccessForm, SectionHeading],
  templateUrl: './sanctuary-doctrine.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanctuaryDoctrine {}
