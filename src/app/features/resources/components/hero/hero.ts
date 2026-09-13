import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Resources hero: eyebrow, headline, subtext, and three static tag pills
 * (accreditation standard, declassified cycle, language list). No language
 * switcher — the language tag is a static informational list.
 */
@Component({
  selector: 'app-resources-hero',
  standalone: true,
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesHero {}
