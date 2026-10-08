import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from '../../../../shared/ui/card/card';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';

interface Approach {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

/** "Our distinctive approach" — the six operating principles, as image cards. */
@Component({
  selector: 'app-approach-grid',
  standalone: true,
  imports: [StaggerRevealDirective, Card],
  templateUrl: './approach-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproachGrid {
  readonly approaches: Approach[] = [
    {
      title: 'State Primacy',
      description: 'We support, not replace, state authority.',
      imageUrl: '/images/about/approach-state-primacy.jpg',
      imageAlt: 'A lone acacia tree on the savanna at sunset',
    },
    {
      title: 'Community Ownership',
      description: 'Communities lead the agenda. Solutions are locally owned and legitimate.',
      imageUrl: '/images/about/approach-community-ownership.jpg',
      imageAlt: 'Four hands clasping one another’s wrists in a chain',
    },
    {
      title: 'Differentiated Engagement',
      description: 'Tailored approaches for diverse groups and motivations.',
      imageUrl: '/images/about/approach-differentiated-engagement.jpg',
      imageAlt: 'Rows of national flags lining the approach to the United Nations in Geneva',
    },
    {
      title: 'Hybrid Mediation',
      description: 'Blending traditional systems, religious jurisprudence and modern practice.',
      imageUrl: '/images/about/approach-hybrid-mediation.jpg',
      imageAlt: 'An antique map of Africa showing Niger, Chad and Mali',
    },
    {
      title: 'Incremental Peacebuilding',
      description: 'Starting with practical local issues to build trust and confidence.',
      imageUrl: '/images/about/approach-incremental-peacebuilding.jpg',
      imageAlt: 'A seaside wall painted with the words “World Peace” repeated',
    },
    {
      title: 'Regional Harmonization',
      description: 'Bridging ECOWAS and AES through policy coherence and shared learning.',
      imageUrl: '/images/about/approach-regional-harmonization.jpg',
      imageAlt: 'Two women in bright headscarves talking, one carrying a young child',
    },
  ];
}
