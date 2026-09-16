import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ImageFadeInDirective } from '../../directives/image-fade-in.directive';

export interface PartnerLogo {
  name: string;
  imageUrl: string;
}

/** "Our Supporters" partner logo row. Static grid, no carousel/animation. */
@Component({
  selector: 'app-logo-strip',
  standalone: true,
  imports: [ImageFadeInDirective],
  templateUrl: './logo-strip.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoStrip {
  @Input() logos: PartnerLogo[] = [];
  /** Index before which a vertical divider is rendered (grouping first N logos vs. the rest). */
  @Input() dividerIndex = -1;
}
