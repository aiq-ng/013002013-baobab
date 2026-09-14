import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge } from '../badge/badge';

export interface ProgramPreview {
  slug: string;
  badgeText: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
}

/**
 * Operational theater preview grid — image-overlay cards with a badge, title,
 * description, and CTA scrimmed over the photo. Shared by Home ("Our Operational
 * Theaters"), Programs ("Active Programs & Theaters"), and About so all three stay
 * visually identical.
 */
@Component({
  selector: 'app-program-grid',
  standalone: true,
  imports: [Badge, RouterLink],
  templateUrl: './program-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramGrid {
  @Input({ required: true }) programs: ProgramPreview[] = [];
  @Input() ctaLabel = 'View Program →';
}
