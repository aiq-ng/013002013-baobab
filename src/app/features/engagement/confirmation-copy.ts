import { EngagementSource } from '../../core/models/engagement-request';

export interface ConfirmationCopy {
  headline: string;
  subtext: string;
  retryRoute: string;
  retryLabel: string;
}

const CONFIRMATION_COPY: Record<EngagementSource, ConfirmationCopy> = {
  'home-dialogue': {
    headline: 'Dialogue initiated',
    subtext: 'Our team will reach out to schedule your strategic dialogue shortly.',
    retryRoute: '/',
    retryLabel: 'Send another request',
  },
  'programs-sovereign-dialogue': {
    headline: 'Sovereign dialogue request received',
    subtext: 'A programs liaison will follow up on your dialogue request shortly.',
    retryRoute: '/programs',
    retryLabel: 'Send another request',
  },
  'program-confidential-dispatch': {
    headline: 'Confidential dispatch received',
    subtext: 'Your dispatch has been logged and routed to the relevant program desk.',
    retryRoute: '/programs',
    retryLabel: 'Send another dispatch',
  },
  'resources-newsletter': {
    headline: "You're subscribed",
    subtext:
      "We'll email you when new publications and updates from The Baobab Group are released.",
    retryRoute: '/resources',
    retryLabel: 'Back to resources',
  },
  'contact-form': {
    headline: 'Message received',
    subtext: 'Thank you for reaching out — our team will respond as soon as possible.',
    retryRoute: '/contact',
    retryLabel: 'Send another message',
  },
  'partnerships-dialogue': {
    headline: 'Your message has been sent',
    subtext: 'Your message has been sent Thank you. A member of our team will reply',
    retryRoute: '/partnerships',
    retryLabel: 'Send another request',
  },
};

const FALLBACK_COPY: ConfirmationCopy = {
  headline: 'Submission received',
  subtext: 'Thank you — your submission has been received.',
  retryRoute: '/',
  retryLabel: 'Send another submission',
};

/**
 * Resolves the confirmation copy for one of the site's 6 email-capture entry
 * points, shared by both the shared success modal and the deep-linkable
 * `/success` route so the copy is defined in exactly one place.
 */
export function confirmationCopyFor(source: EngagementSource | null | undefined): ConfirmationCopy {
  return (source && CONFIRMATION_COPY[source]) || FALLBACK_COPY;
}
