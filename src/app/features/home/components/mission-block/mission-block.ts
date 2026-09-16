import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/** "Know About Us" mission block with the ancestral-sanctuary portrait and doctrine download. */
@Component({
  selector: 'app-mission-block',
  standalone: true,
  imports: [Eyebrow, NgOptimizedImage, ImageFadeInDirective],
  templateUrl: './mission-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionBlock {}
