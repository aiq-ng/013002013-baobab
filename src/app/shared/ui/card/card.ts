import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Badge } from '../badge/badge';

/**
 * Generic composable content card (image + badge + projected title/body/link).
 * Used for operational-theater preview cards and reusable elsewhere via content projection.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [Badge, NgOptimizedImage],
  templateUrl: './card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  @Input() imageUrl: string | null = null;
  @Input() imageAlt = '';
  @Input() badgeText: string | null = null;
}
