import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { Button } from '../../../../shared/ui/button/button';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/** "Who We Are" block with the spokesperson portrait and an About Us CTA. */
@Component({
  selector: 'app-mission-block',
  standalone: true,
  imports: [Eyebrow, Button, NgOptimizedImage, ImageFadeInDirective],
  templateUrl: './mission-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionBlock {}
