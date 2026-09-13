import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';

/** Contact page hero: intro copy + direct liaison details, per "CONTACT US.png". */
@Component({
  selector: 'app-contact-hero',
  standalone: true,
  imports: [Eyebrow],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactHero {}
