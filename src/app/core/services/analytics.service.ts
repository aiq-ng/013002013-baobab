import { Injectable } from '@angular/core';

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
}

/**
 * Thin wrapper so every CTA/form call site is provider-agnostic.
 * Swap the `dispatch` implementation for GA4/Plausible/etc. without touching callers.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  trackEvent(event: AnalyticsEvent): void {
    this.dispatch(event);
  }

  trackCtaClick(ctaId: string, context?: Record<string, string>): void {
    this.dispatch({ name: 'cta_click', params: { cta_id: ctaId, ...context } });
  }

  trackFormSubmit(formId: string, context?: Record<string, string>): void {
    this.dispatch({ name: 'form_submit', params: { form_id: formId, ...context } });
  }

  private dispatch(event: AnalyticsEvent): void {
    if (typeof window === 'undefined') return;
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.('event', event.name, event.params);
  }
}
