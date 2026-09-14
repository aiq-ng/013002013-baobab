import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface PartnerLogo {
  name: string;
  imageUrl: string;
}

/** "Our Supporters" partner logo row. Static grid, no carousel/animation. */
@Component({
  selector: 'app-logo-strip',
  standalone: true,
  templateUrl: './logo-strip.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoStrip {
  @Input() logos: PartnerLogo[] = [];
  /** Index before which a vertical divider is rendered (grouping first N logos vs. the rest). */
  @Input() dividerIndex = -1;
}
