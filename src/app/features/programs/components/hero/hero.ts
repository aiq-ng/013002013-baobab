import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/** Programs listing hero: full-bleed photo, eyebrow, headline, and subtext. */
@Component({
  selector: 'app-programs-hero',
  standalone: true,
  imports: [NgOptimizedImage, ImageFadeInDirective],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsHero {}
