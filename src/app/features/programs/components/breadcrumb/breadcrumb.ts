import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge } from '../../../../shared/ui/badge/badge';
import { BackLink } from '../../../../shared/ui/back-link/back-link';

/** Program detail breadcrumb + status badge + reference/clearance metadata row. */
@Component({
  selector: 'app-program-breadcrumb',
  standalone: true,
  imports: [RouterLink, Badge, BackLink],
  templateUrl: './breadcrumb.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramBreadcrumb {
  @Input({ required: true }) theater = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) statusTag = '';
  @Input({ required: true }) referenceCode = '';
  @Input({ required: true }) clearanceLevel = '';
}
