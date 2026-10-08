import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaggerRevealDirective } from '../../../../shared/directives/stagger-reveal.directive';

export interface FaqEntry {
  question: string;
  answer: string;
  /** Optional inline link rendered after `answer`, followed by `answerSuffix`. */
  link?: { label: string; route: string };
  answerSuffix?: string;
}

const FAQS: FaqEntry[] = [
  {
    question: 'Who do you work with?',
    answer:
      'Governments and local authorities, traditional and religious institutions, ECOWAS, AES and AU, UN agencies and international partners, civil society and community organizations, and development partners and donors.',
  },
  {
    question: 'Where do you work?',
    answer: 'Across ECOWAS and AES countries in West Africa.',
  },
  {
    question: 'Do you replace state security efforts?',
    answer:
      'No. We support, not replace, state authority, and our non-kinetic work complements legitimate security efforts.',
  },
  {
    question: 'Is engagement confidential?',
    answer:
      'We are flexible, confidential and results-oriented. We will agree how to handle your information when we speak.',
  },
  {
    question: 'How do I read your publications?',
    answer: 'Visit the ',
    link: { label: 'Resources', route: '/resources' },
    answerSuffix: ' page to download our strategy document and publications.',
  },
];

/**
 * Contact page FAQ: heading + a "Key Mandates & Sovereign Protocols" card
 * listing all 5 questions, per "CONTACT US (1).png" — its CTA scrolls back up
 * to the contact form.
 */
@Component({
  selector: 'app-contact-faq',
  standalone: true,
  imports: [StaggerRevealDirective, RouterLink],
  templateUrl: './faq.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFaq {
  readonly faqs = FAQS;
}
