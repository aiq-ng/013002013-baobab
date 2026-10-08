import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';

/** Contact page hero: eyebrow, headline and intro copy, per "CONTACT US (1).png". */
@Component({
  selector: 'app-contact-hero',
  standalone: true,
  imports: [Eyebrow],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactHero {}
