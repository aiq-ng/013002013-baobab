import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface FaqEntry {
  question: string;
  answer: string;
}

const FAQS: FaqEntry[] = [
  {
    question: 'How can my government or institution initiate a dialogue?',
    answer:
      'Reach the Office of the Permanent Secretariat through this dispatch form. Verified envoy inquiries receive formal acknowledgement within 48 hours.',
  },
  {
    question: 'Is engagement with The Baobab Group confidential?',
    answer:
      "Yes. All Track 1.5 proceedings strictly adhere to the Dakar Framework's diplomatic non-disclosure standards.",
  },
  {
    question: 'Which regional theaters does Baobab currently cover?',
    answer:
      'Active missions span the Sahel Central, Lake Chad Basin, Gulf of Guinea littoral zones, and ECOWAS member states.',
  },
  {
    question: 'Urgent mediation turnaround time?',
    answer:
      'Priority mediation alerts are routed to the field secretariat desk within 4 business hours.',
  },
  {
    question: 'Access to statecraft archives & customary treaties?',
    answer:
      'Public codices are openly readable; unredacted accords require verified institutional credentials.',
  },
];

/**
 * Contact page FAQ: heading + a "Key Mandates & Sovereign Protocols" preview
 * card listing all 5 questions, per "CONTACT US.png" — links out to the full
 * `/contact/faq` directives page rather than expanding inline.
 */
@Component({
  selector: 'app-contact-faq',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './faq.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFaq {
  readonly faqs = FAQS;
}
