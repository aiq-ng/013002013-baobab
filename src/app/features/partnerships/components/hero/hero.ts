import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/**
 * Partnerships hero: eyebrow, headline, subtext, and a video embed of the
 * Plenary Assembly with poster frame + play control, matching the
 * "PARTNERSHIPS 1" export.
 */
@Component({
  selector: 'app-partnerships-hero',
  standalone: true,
  imports: [ImageFadeInDirective],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnershipsHero {
  readonly isPlaying = signal(false);
  readonly caption = 'Plenary Assembly of Sovereign Custodians & Multilateral Partners';

  play(): void {
    this.isPlaying.set(true);
  }
}
