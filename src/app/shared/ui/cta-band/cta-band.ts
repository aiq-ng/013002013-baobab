import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../button/button';

/**
 * Closing dual-CTA gradient band. Primary CTA is always visually dominant;
 * secondary is always rendered with the subordinate button style.
 */
@Component({
  selector: 'app-cta-band',
  standalone: true,
  imports: [Button],
  templateUrl: './cta-band.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaBand {
  @Input({ required: true }) heading = '';
  @Input() subtext = '';
  @Input() backgroundImage = '';
  @Input({ required: true }) primaryLabel = '';
  @Input() primaryRoute: string | null = null;
  @Input() primaryCtaId: string | null = null;
  @Input() secondaryLabel = '';
  @Input() secondaryRoute: string | null = null;
  @Input() secondaryCtaId: string | null = null;

  @Output() readonly primaryPressed = new EventEmitter<void>();
  @Output() readonly secondaryPressed = new EventEmitter<void>();
}
