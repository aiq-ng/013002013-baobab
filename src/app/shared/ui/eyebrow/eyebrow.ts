import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Small-caps section label with a leading rule mark, e.g. "KNOW ABOUT US". */
@Component({
  selector: 'app-eyebrow',
  standalone: true,
  templateUrl: './eyebrow.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Eyebrow {
  @Input({ required: true }) text = '';
}
