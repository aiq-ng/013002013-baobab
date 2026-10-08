import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Button } from '../../shared/ui/button/button';
import { SuccessModal } from '../../features/engagement/success-modal/success-modal';
import { ImageFadeInDirective } from '../../shared/directives/image-fade-in.directive';
import { StaggerRevealDirective } from '../../shared/directives/stagger-reveal.directive';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    StaggerRevealDirective,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Button,
    SuccessModal,
    NgOptimizedImage,
    ImageFadeInDirective,
  ],
  templateUrl: './public-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayout {
  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  readonly currentYear = new Date().getFullYear();

  readonly navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Programs', path: '/programs' },
    { label: 'Resources', path: '/resources' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
  ];

  readonly footerPrograms = [
    'Sovereign Dialogue Facilitation',
    'Hybrid Mediation & Reconciliation',
    'Community Resilience',
    'Research & Early Warning',
    'Disengagement, DDR & Reintegration',
    'Policy Advisory & Regional Harmonization',
  ];

  readonly exploreLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Resources', path: '/resources' },
    { label: 'Partnerships', path: '/partnerships' },
    { label: 'Contact Us', path: '/contact' },
  ];

  // Privacy Policy / Terms of Use have no dedicated routes yet.
  // Routed to the nearest real, already-built page as a temporary stand-in pending
  // dedicated legal routes — never a bare "#" dead link.
  readonly legalLinks = [
    { label: 'Privacy Policy', path: '/about' },
    { label: 'Terms of Use', path: '/about' },
    { label: 'Portal Login', path: '/console' },
  ];
}
