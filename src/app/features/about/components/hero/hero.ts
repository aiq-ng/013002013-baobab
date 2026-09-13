import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';

/** About Us hero: "KNOW ABOUT US" eyebrow, mission headline, and founding intro copy. */
@Component({
  selector: 'app-about-hero',
  standalone: true,
  imports: [Eyebrow],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutHero {}
