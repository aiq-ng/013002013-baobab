import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

/** Documentary archival-reel video embed with a poster frame and play control. */
@Component({
  selector: 'app-documentary-video',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './documentary-video.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentaryVideo {
  readonly isPlaying = signal(false);
  readonly caption =
    'Documented Archival Reel: Tillabéri Cross-Border Pastoral Conciliation (1998–2024)';

  play(): void {
    this.isPlaying.set(true);
  }
}
