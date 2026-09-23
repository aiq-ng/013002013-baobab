import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProtectionItem } from '../../models/resource';
import { SectionHeading } from '../../../../shared/ui/section-heading/section-heading';

/** "Privacy & Sovereign Data Protections" 3-item icon grid. */
@Component({
  selector: 'app-data-protections',
  standalone: true,
  imports: [SectionHeading],
  templateUrl: './data-protections.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataProtections {
  @Input({ required: true }) items: ProtectionItem[] = [];
}
