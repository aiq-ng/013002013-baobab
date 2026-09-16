import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/** Full-width Head Office location photo banner, per "Contact us 3.png". */
@Component({
  selector: 'app-contact-location-banner',
  standalone: true,
  imports: [NgOptimizedImage, ImageFadeInDirective],
  templateUrl: './location-banner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLocationBanner {}
