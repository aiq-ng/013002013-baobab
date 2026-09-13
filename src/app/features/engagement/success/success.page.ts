import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Button } from '../../../shared/ui/button/button';
import { EngagementSource } from '../../../core/models/engagement-request';

interface ConfirmationCopy {
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
  'resources-addendum': {
    headline: 'Addendum request received',
    subtext: 'The requested addendum will be sent to your inbox shortly.',
    retryRoute: '/resources',
    retryLabel: 'Request another addendum',
  },
  'resources-classified-access': {
    headline: 'Access request received',
    subtext: 'Your classified access request is under review. We will be in touch.',
    retryRoute: '/resources',
    retryLabel: 'Submit another request',
  },
  'contact-form': {
    headline: 'Message received',
    subtext: 'Thank you for reaching out — our team will respond as soon as possible.',
    retryRoute: '/contact',
    retryLabel: 'Send another message',
  },
};

const FALLBACK_COPY: ConfirmationCopy = {
  headline: 'Submission received',
  subtext: 'Thank you — your submission has been received.',
  retryRoute: '/',
  retryLabel: 'Send another submission',
};

/**
 * Shared success confirmation for all 5 email-capture entry points across the
 * site. Copy is parameterized by the `source` query param so one component and
 * one route serve every flow (per PRD: all 5 CTAs -> one shared success state).
 */
@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [Button],
  templateUrl: './success.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessPage {
  private readonly route = inject(ActivatedRoute);

  private readonly queryParams = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => ({
        ref: params.get('ref'),
        source: params.get('source') as EngagementSource | null,
      })),
    ),
    { initialValue: { ref: null, source: null } },
  );

  readonly referenceId = computed(() => this.queryParams().ref ?? '—');

  readonly copy = computed(() => {
    const source = this.queryParams().source;
    return (source && CONFIRMATION_COPY[source]) || FALLBACK_COPY;
  });
}
