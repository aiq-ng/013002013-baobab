import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Badge } from '../../../../shared/ui/badge/badge';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/** "About this program:" — the program photo card beside its narrative paragraphs. */
@Component({
  selector: 'app-program-about',
  standalone: true,
  imports: [NgOptimizedImage, Badge, Eyebrow, ImageFadeInDirective],
  templateUrl: './program-about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramAbout {
  @Input({ required: true }) title = '';
  @Input({ required: true }) badgeText = '';
  @Input({ required: true }) imageUrl = '';
  @Input({ required: true }) imageAlt = '';
  @Input({ required: true }) paragraphs: string[] = [];
}
