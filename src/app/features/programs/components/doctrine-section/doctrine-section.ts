import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProgramStat } from '../../models/program';

/** Doctrine narrative with a photo dossier and inline stats, on a program detail page. */
@Component({
  selector: 'app-doctrine-section',
  standalone: true,
  templateUrl: './doctrine-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctrineSection {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) heading = '';
  @Input({ required: true }) paragraphs: string[] = [];
  @Input({ required: true }) imageUrl = '';
  @Input({ required: true }) imageCaption = '';
  @Input({ required: true }) stats: ProgramStat[] = [];
}
