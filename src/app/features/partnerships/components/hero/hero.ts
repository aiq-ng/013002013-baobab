import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/**
 * Partnerships hero: eyebrow, headline, subtext, and community image,
 * matching the "PARTNERSHIPS 1" export.
 */
@Component({
  selector: 'app-partnerships-hero',
  standalone: true,
  imports: [ImageFadeInDirective],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnershipsHero {}
