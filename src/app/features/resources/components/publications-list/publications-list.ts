import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RegistryDocument } from '../../models/resource';
import { PublicationCard } from '../publication-card/publication-card';
import { StatusPanel } from '../../../../shared/ui/status-panel/status-panel';

/** "All publications": every published resource after the featured one. */
@Component({
  selector: 'app-publications-list',
  standalone: true,
  imports: [PublicationCard, StatusPanel],
  templateUrl: './publications-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationsList {
  readonly documents = input.required<RegistryDocument[]>();
}
