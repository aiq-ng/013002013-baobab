import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RegistryDocument } from '../../models/resource';
import { SectionHeading } from '../../../../shared/ui/section-heading/section-heading';

/**
 * "Document Registry": the actual uploaded resources from the backend
 * (`GET /api/v1/resources`, the same records the console's Resources screen
 * manages) — distinct from the static Treaties & Conciliation Archive above it.
 */
@Component({
  selector: 'app-document-registry',
  standalone: true,
  imports: [SectionHeading],
  templateUrl: './document-registry.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentRegistry {
  @Input() documents: RegistryDocument[] = [];

  formatSize(bytes: number): string {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
