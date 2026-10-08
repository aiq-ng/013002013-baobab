import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

export type TrackIcon = 'institution' | 'network' | 'community';

interface Track {
  eyebrow: string;
  title: string;
  description: string;
  icon: TrackIcon;
  emphasized: boolean;
}

/** "Our response" — Track 1 / Track 1.5 / Track 2 dual-track cards plus a full-width banner. */
@Component({
  selector: 'app-track-model',
  standalone: true,
  imports: [Eyebrow, NgOptimizedImage, ImageFadeInDirective],
  templateUrl: './track-model.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackModel {
  readonly tracks: Track[] = [
    {
      eyebrow: 'TRACK 1',
      title: 'Legitimate Security Operations',
      description: 'Continued state-led operations against irreconcilable violent actors.',
      icon: 'institution',
      emphasized: false,
    },
    {
      eyebrow: 'TRACK 1.5',
      title: 'Working together',
      description:
        'These two tracks are mutually reinforcing pillars of a comprehensive peace strategy.',
      icon: 'network',
      emphasized: true,
    },
    {
      eyebrow: 'TRACK 2',
      title: 'Non-Kinetic Engagement',
      description:
        'Preventing conflict, reconciliation, confidence building and community stabilization.',
      icon: 'community',
      emphasized: false,
    },
  ];
}
