import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Button } from '../../shared/ui/button/button';
import { SuccessModal } from '../../features/engagement/success-modal/success-modal';
import { ImageFadeInDirective } from '../../shared/directives/image-fade-in.directive';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
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
  readonly currentYear = new Date().getFullYear();

  readonly navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Programs', path: '/programs' },
    { label: 'Resources', path: '/resources' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
  ];

  readonly thematicFocus = [
    'Transhumance Grazing Pacts',
    'Customary Sultanate Jurisprudence',
    'Non-Kinetic Disarmament & Re-entry',
    'Cross-Border Borderland Security',
    'Inter-Faith Elder Councils',
  ];

  readonly regionalHubs = [
    'Dakar (Executive HQ)',
    'Abuja (ECOWAS Secretariat)',
    'Niamey (Sahel Mission)',
    'Ouagadougou (Liptako)',
    'Accra (Littoral Liaison)',
  ];

  readonly doctrineRecords = [
    'Annual Statecraft Review (2024–2025)',
    'Treaties & Conciliation Archive',
    'Track 1.5 Confidential Protocol',
    'Privacy & Sovereign Data Protections',
  ];

  // Security Protocol / Diplomatic Status / Portal Login have no dedicated routes yet.
  // Routed to the nearest real, already-built pages as temporary stand-ins pending
  // dedicated legal/auth routes in a later phase — never a bare "#" dead link.
  readonly legalLinks = [
    { label: 'Security Protocol', path: '/about' },
    { label: 'Diplomatic Status', path: '/about' },
    { label: 'Portal Login', path: '/contact' },
  ];
}
