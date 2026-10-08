import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { Badge } from '../../../../shared/ui/badge/badge';
import { Button } from '../../../../shared/ui/button/button';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';

interface ProgramArea {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

/** "Programs preview" — 3 of the six program areas, each linking through to Programs. */
@Component({
  selector: 'app-programs-preview',
  standalone: true,
  imports: [
    StaggerRevealDirective,
    Eyebrow,
    Badge,
    Button,
    RouterLink,
    NgOptimizedImage,
    ImageFadeInDirective,
  ],
  templateUrl: './programs-preview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsPreview {
  readonly programs: ProgramArea[] = [
    {
      title: 'Sovereign Dialogue Facilitation',
      description:
        'Support for inclusive dialogue between governments, communities and stakeholders at all levels.',
      imageUrl: '/images/programs/detail-hero-community-gathering.jpg',
      imageAlt: 'Community members gathered for a dialogue session',
    },
    {
      title: 'Hybrid Mediation & Reconciliation',
      description:
        'Integrating traditional governance, religious legitimacy and modern mediation for credible outcomes.',
      imageUrl: '/images/programs/card-hybrid-mediation.jpg',
      imageAlt: 'Mediators in a reconciliation conversation',
    },
    {
      title: 'Community Resilience & Socio-Economic Programs',
      description:
        'Supporting livelihoods, youth, women, education and local governance to reduce vulnerability to violence.',
      imageUrl: '/images/programs/card-community-resilience.jpg',
      imageAlt: 'Hands joined together in solidarity',
    },
  ];
}
