import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

/** Full-width community photo banner, per "CONTACT US (1).png". */
@Component({
  selector: 'app-contact-location-banner',
  standalone: true,
  imports: [NgOptimizedImage, ImageFadeInDirective],
  templateUrl: './location-banner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLocationBanner {}
