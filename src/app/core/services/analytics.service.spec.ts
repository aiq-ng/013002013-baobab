import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let gtagSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsService);
    gtagSpy = vi.fn();
    (window as unknown as { gtag: unknown }).gtag = gtagSpy;
  });

  afterEach(() => {
    delete (window as unknown as { gtag?: unknown }).gtag;
  });

  it('dispatches a generic tracked event with its params', () => {
    service.trackEvent({ name: 'custom_event', params: { foo: 'bar' } });

    expect(gtagSpy).toHaveBeenCalledWith('event', 'custom_event', { foo: 'bar' });
  });

  it('dispatches a cta_click event with the cta id and context', () => {
    service.trackCtaClick('strategic-partnerships', { page: 'home' });

    expect(gtagSpy).toHaveBeenCalledWith('event', 'cta_click', {
      cta_id: 'strategic-partnerships',
      page: 'home',
    });
  });

  it('dispatches a form_submit event with the form id and context', () => {
    service.trackFormSubmit('contact-form', { page: 'contact' });

    expect(gtagSpy).toHaveBeenCalledWith('event', 'form_submit', {
      form_id: 'contact-form',
      page: 'contact',
    });
  });

  it('does not throw when gtag is not present on window', () => {
    delete (window as unknown as { gtag?: unknown }).gtag;

    expect(() => service.trackEvent({ name: 'custom_event' })).not.toThrow();
  });
});
