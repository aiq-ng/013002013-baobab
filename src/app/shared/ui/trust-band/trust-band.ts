import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Full-width green band of trust claims shown under the Home and Programs heroes. */
@Component({
  selector: 'app-trust-band',
  standalone: true,
  templateUrl: './trust-band.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustBand {}
