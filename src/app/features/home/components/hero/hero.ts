import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Button } from '../../../../shared/ui/button/button';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/** Home hero: full-bleed baobab image, headline, subtext, primary + secondary CTA. */
@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [Button, NgOptimizedImage, ImageFadeInDirective],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {}
