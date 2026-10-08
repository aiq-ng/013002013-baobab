import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Resources hero: eyebrow, "Strategy and publications" headline, and subtext. */
@Component({
  selector: 'app-resources-hero',
  standalone: true,
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesHero {}
