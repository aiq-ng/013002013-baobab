import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { createEngagementSubmission } from './engagement-submission';
import { SuccessModalService } from './success-modal.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

describe('createEngagementSubmission', () => {
  let httpMock: HttpTestingController;
  let fb: FormBuilder;
  let successModalService: SuccessModalService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    fb = TestBed.inject(FormBuilder);
    successModalService = TestBed.inject(SuccessModalService);
    analyticsService = TestBed.inject(AnalyticsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function buildForm() {
    return fb.nonNullable.group({
      email: [''],
      name: [''],
    });
  }

  it('does nothing and marks controls touched when the form is invalid', () => {
    const controller = TestBed.runInInjectionContext(() => createEngagementSubmission());
    const form = buildForm();
    form.controls.email.addValidators(() => ({ required: true }));
    form.controls.email.updateValueAndValidity();

    controller.submit(form, { source: 'contact-form', name: 'A', email: '' });

    expect(form.controls.email.touched).toBe(true);
    httpMock.expectNone(() => true);
  });

  it('sets submitting while in flight and clears it on success, showing the success modal', () => {
    const controller = TestBed.runInInjectionContext(() => createEngagementSubmission());
    const showSpy = vi.spyOn(successModalService, 'show');
    const trackSpy = vi.spyOn(analyticsService, 'trackFormSubmit');
    const form = buildForm();
    form.patchValue({ email: 'a@b.com', name: 'Ada' });

    controller.submit(form, { source: 'contact-form', name: 'Ada', email: 'a@b.com' });
    expect(controller.submitting()).toBe(true);

    const req = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
    req.flush({ referenceId: 'BB-9', submittedAt: '2026-01-01T00:00:00Z' });

    expect(controller.submitting()).toBe(false);
    expect(showSpy).toHaveBeenCalledWith('contact-form', 'BB-9');
    expect(trackSpy).toHaveBeenCalledWith('contact-form');
    expect(form.controls.email.value).toBe('');
  });

  it('ignores a second submit while one is already in flight', () => {
    const controller = TestBed.runInInjectionContext(() => createEngagementSubmission());
    const form = buildForm();
    form.patchValue({ email: 'a@b.com', name: 'Ada' });

    controller.submit(form, { source: 'contact-form', name: 'Ada', email: 'a@b.com' });
    controller.submit(form, { source: 'contact-form', name: 'Ada', email: 'a@b.com' });

    httpMock.expectOne((r) => r.url.endsWith('/engagements'));
  });

  it('maps a 422 field error onto the matching control and leaves the form filled', () => {
    const controller = TestBed.runInInjectionContext(() => createEngagementSubmission());
    const form = buildForm();
    form.patchValue({ email: 'not-an-email', name: 'Ada' });

    controller.submit(form, { source: 'contact-form', name: 'Ada', email: 'not-an-email' });

    const req = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
    req.flush(
      { detail: [{ loc: ['body', 'email'], msg: 'value is not a valid email address' }] },
      { status: 422, statusText: 'Unprocessable Entity' },
    );

    expect(controller.submitting()).toBe(false);
    expect(form.controls.email.errors?.['server']).toBe('value is not a valid email address');
    expect(form.controls.email.value).toBe('not-an-email');
  });

  it('shows a readable message for a 429 and does not open the success modal', () => {
    const controller = TestBed.runInInjectionContext(() => createEngagementSubmission());
    const showSpy = vi.spyOn(successModalService, 'show');
    const form = buildForm();
    form.patchValue({ email: 'a@b.com', name: 'Ada' });

    controller.submit(form, { source: 'contact-form', name: 'Ada', email: 'a@b.com' });
    const req = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
    req.flush({ detail: 'slow down' }, { status: 429, statusText: 'Too Many Requests' });

    expect(controller.errorMessage()).toMatch(/too many requests/i);
    expect(showSpy).not.toHaveBeenCalled();
  });

  it('shows a readable message for a 5xx after the automatic retry fails', async () => {
    vi.useFakeTimers();
    try {
      const controller = TestBed.runInInjectionContext(() => createEngagementSubmission());
      const form = buildForm();
      form.patchValue({ email: 'a@b.com', name: 'Ada' });

      controller.submit(form, { source: 'contact-form', name: 'Ada', email: 'a@b.com' });

      const first = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
      first.flush('boom', { status: 500, statusText: 'Server Error' });

      await vi.advanceTimersByTimeAsync(2000);

      const second = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
      second.flush('boom again', { status: 500, statusText: 'Server Error' });

      expect(controller.errorMessage()).toMatch(/went wrong/i);
    } finally {
      vi.useRealTimers();
    }
  });
});
