import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../card/card';
import { Button } from '../button/button';

export interface ProgramPreview {
  slug: string;
  badgeText: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
}

/**
 * "Active Programs & Theaters" grid. Shared between About and Programs pages —
 * a static grid of program preview cards, each linking to its program detail route.
 */
@Component({
  selector: 'app-program-grid',
  standalone: true,
  imports: [Card, Button, RouterLink],
  templateUrl: './program-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramGrid {
  @Input({ required: true }) programs: ProgramPreview[] = [];
}
