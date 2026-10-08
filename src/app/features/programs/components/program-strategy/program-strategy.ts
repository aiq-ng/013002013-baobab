import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Button } from '../../../../shared/ui/button/button';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/** Key points list + "From our strategy" heading, expected impact, About Us CTA and portrait. */
@Component({
  selector: 'app-program-strategy',
  standalone: true,
  imports: [NgOptimizedImage, Button, Eyebrow, ImageFadeInDirective],
  templateUrl: './program-strategy.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramStrategy {
  @Input({ required: true }) keyPoints: string[] = [];
  @Input({ required: true }) heading = '';
  @Input({ required: true }) expectedImpact = '';
  @Input({ required: true }) imageUrl = '';
  @Input({ required: true }) imageAlt = '';
}
