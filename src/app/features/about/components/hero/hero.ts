import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';

/** About Us hero: "ABOUT US" eyebrow, headline, and institutional intro copy. */
@Component({
  selector: 'app-about-hero',
  standalone: true,
  imports: [StaggerRevealDirective, Eyebrow],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutHero {}
