import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';

export interface Directive {
  categoryTag: string;
  directiveCode: string;
  accentClass: string;
  question: string;
  answer: string;
  meta: string;
}

const DIRECTIVES: Directive[] = [
  {
    categoryTag: 'INITIATION & LIAISON',
    directiveCode: 'Directive 01 / PRO-IN',
    accentClass: 'border-brand-600',
    question: 'How can my government or institution initiate a dialogue?',
    answer:
      'Reach the Office of the Permanent Secretariat through this form or the Strategic Partnerships channel. Requests from accredited ministerial or institutional envoys are typically acknowledged within 48 hours.',
    meta: 'Response Window: 48 Hours · Accredited Verification Pathway',
  },
  {
    categoryTag: 'CONFIDENTIALITY & LEGAL IMMUNITY',
    directiveCode: 'Directive 02 / SEC-NON',
    accentClass: 'border-sky-600',
    question: 'Is engagement with The Baobab Group confidential?',
    answer:
      "Yes. All Track 1.5 proceedings operate under the Dakar Framework's non-disclosure and immunity standard. Participant identities and negotiation records are not subject to disclosure to domestic or non-regional bodies.",
    meta: 'Dakar Framework Sovereign Shield · Article 14 Multi-lateral Protection',
  },
  {
    categoryTag: 'GEOGRAPHIC SCOPE & THEATERS',
    directiveCode: 'Directive 03 / THEA-REG',
    accentClass: 'border-amber-600',
    question: 'Which regions does The Baobab Group currently operate in?',
    answer:
      'Active theaters include Sahel Central, the Lake Chad Basin, the Gulf of Guinea, and Continental ECOWAS. See our Programs page for current accords and field dossiers in each theater.',
    meta: 'Active Mandate Zones: 4 Theaters · 15 Sovereign Border Corridors',
  },
  {
    categoryTag: 'RAPID RESPONSE PROTOCOL',
    directiveCode: 'Directive 04 / FAST-ACT',
    accentClass: 'border-rose-600',
    question: 'How quickly can Baobab respond to an urgent mediation request?',
    answer:
      "Time-sensitive requests flagged as urgent are routed directly to the Secretariat's field liaison desk and typically receive an initial response within 4 hours during business days.",
    meta: 'Rapid De-escalation Protocol · 4-Hour Urgent Response SLA',
  },
  {
    categoryTag: 'ARCHIVES & INTELLECTUAL PROPERTY',
    directiveCode: 'Directive 05 / ARC-AUTH',
    accentClass: 'border-slate-500',
    question: 'Can researchers or journalists request access to your archive?',
    answer:
      'Public codices and treaty summaries are available on the Resources page without accreditation. Classified dossiers, telemetry, and unredacted accords require verified institutional or delegation credentials via the Track 1.5 access gate.',
    meta: 'Tiered Registry Access · Biometric / Cryptographic Portal Gate',
  },
];

/**
 * Full FAQ / directives page reached from the Contact page's "View All 5 FAQs"
 * CTA, per "KEY MANDATES CONTACT US (2).png".
 */
@Component({
  selector: 'app-faq-detail-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './faq-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqDetailPage implements OnInit {
  private readonly seo = inject(SeoService);

  readonly directives = DIRECTIVES;

  ngOnInit(): void {
    this.seo.update({
      title: 'Key Mandates & Sovereign Protocols',
      description:
        'Verified institutional directives for member states, regional bodies, traditional custodians, and accredited researchers engaging The Baobab Group under Track 1.5 sovereign peacecraft.',
    });
  }
}
