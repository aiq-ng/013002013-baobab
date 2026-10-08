import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/** Full-width "Amani Africa" image banner with a caption pill, below the About hero. */
@Component({
  selector: 'app-image-banner',
  standalone: true,
  imports: [NgOptimizedImage, ImageFadeInDirective],
  templateUrl: './image-banner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageBanner {
  readonly caption = 'Frontiers for peace and stability in the West African region';
}
