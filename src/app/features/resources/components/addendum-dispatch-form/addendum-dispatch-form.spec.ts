import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AddendumDispatchForm } from './addendum-dispatch-form';
import { EngagementService } from '../../../engagement/services/engagement.service';
import { SuccessModalService } from '../../../engagement/services/success-modal.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

describe('AddendumDispatchForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<AddendumDispatchForm>>;
  let submit: ReturnType<typeof vi.fn>;
  let show: ReturnType<typeof vi.fn>;
  let trackFormSubmit: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    submit = vi.fn();
    show = vi.fn();
    trackFormSubmit = vi.fn();
    await TestBed.configureTestingModule({
      imports: [AddendumDispatchForm],
      providers: [
        {
          provide: EngagementService,
          useValue: { submit, generateIdempotencyKey: () => 'key-1' },
        },
        { provide: SuccessModalService, useValue: { show } },
        { provide: AnalyticsService, useValue: { trackFormSubmit } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddendumDispatchForm);
    fixture.detectChanges();
  });

  function submitForm() {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('shows a validation error on empty submit without calling the service', () => {
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('shows an invalid-email message for a malformed address', () => {
    fixture.componentInstance.form.setValue({ email: 'not-an-email' });
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('Enter a valid email address.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits to EngagementService and shows the success modal on valid input', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-3', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({ email: 'desk-officer@mfa.gov' });
    submitForm();

    expect(submit).toHaveBeenCalledWith(
      {
        source: 'resources-addendum',
        name: 'desk-officer@mfa.gov',
        email: 'desk-officer@mfa.gov',
      },
      'key-1',
    );
    expect(show).toHaveBeenCalledWith('resources-addendum', 'BB-TEST-3');
    expect(trackFormSubmit).toHaveBeenCalledWith('resources-addendum');
  });

  it('disables the submit button while pending', () => {
    const subject = new Subject<{ referenceId: string; submittedAt: string }>();
    submit.mockReturnValue(subject.asObservable());

    fixture.componentInstance.form.setValue({ email: 'desk-officer@mfa.gov' });
    submitForm();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('shows a readable message on a 429 without opening the success modal', () => {
    submit.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 429 })));

    fixture.componentInstance.form.setValue({ email: 'desk-officer@mfa.gov' });
    submitForm();

    expect(fixture.nativeElement.textContent).toMatch(/too many requests/i);
    expect(show).not.toHaveBeenCalled();
  });
});
