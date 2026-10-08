import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';

/** "Why Baobab?" — the meaning behind the name, beside a baobab grove photo. */
@Component({
  selector: 'app-why-baobab',
  standalone: true,
  imports: [StaggerRevealDirective, Eyebrow, NgOptimizedImage, ImageFadeInDirective],
  templateUrl: './why-baobab.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhyBaobab {}
