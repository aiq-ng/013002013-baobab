import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type SectionHeadingAlign = 'left' | 'center';

/**
 * Standard section header: dot-marked eyebrow + h2 + optional lead paragraph.
 * Every major section on a public page uses this so the eyebrow colour, heading
 * scale, and the gaps between the three lines stay identical site-wide.
 */
@Component({
  selector: 'app-section-heading',
  standalone: true,
  templateUrl: './section-heading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) heading = '';
  @Input() lead: string | null = null;
  @Input() align: SectionHeadingAlign = 'left';

  get alignClass(): string {
    return this.align === 'center' ? 'items-center text-center' : 'items-start';
  }
}
