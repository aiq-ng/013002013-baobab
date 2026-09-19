import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ClassifiedAccessForm } from './classified-access-form';
import { EngagementService } from '../../../engagement/services/engagement.service';
import { SuccessModalService } from '../../../engagement/services/success-modal.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

describe('ClassifiedAccessForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ClassifiedAccessForm>>;
  let submit: ReturnType<typeof vi.fn>;
  let show: ReturnType<typeof vi.fn>;
  let trackFormSubmit: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    submit = vi.fn();
    show = vi.fn();
    trackFormSubmit = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ClassifiedAccessForm],
      providers: [
        {
          provide: EngagementService,
          useValue: { submit, generateIdempotencyKey: () => 'key-1' },
        },
        { provide: SuccessModalService, useValue: { show } },
        { provide: AnalyticsService, useValue: { trackFormSubmit } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassifiedAccessForm);
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
    fixture.componentInstance.form.setValue({ email: 'nope', token: '' });
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('Enter a valid email address.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits without requiring the optional secretarial token', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-4', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({ email: 'envoy@diplomatie.gouv', token: '' });
    submitForm();

    expect(submit).toHaveBeenCalledWith(
      {
        source: 'resources-classified-access',
        name: 'envoy@diplomatie.gouv',
        email: 'envoy@diplomatie.gouv',
        metadata: {},
      },
      'key-1',
    );
    expect(show).toHaveBeenCalledWith('resources-classified-access', 'BB-TEST-4');
    expect(trackFormSubmit).toHaveBeenCalledWith('resources-classified-access');
  });

  it('passes the secretarial token as metadata when provided', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-5', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({
      email: 'envoy@diplomatie.gouv',
      token: 'secret-token',
    });
    submitForm();

    expect(submit).toHaveBeenCalledWith(
      {
        source: 'resources-classified-access',
        name: 'envoy@diplomatie.gouv',
        email: 'envoy@diplomatie.gouv',
        metadata: { delegationSecretarialToken: 'secret-token' },
      },
      'key-1',
    );
  });

  it('disables the submit button while pending', () => {
    const subject = new Subject<{ referenceId: string; submittedAt: string }>();
    submit.mockReturnValue(subject.asObservable());

    fixture.componentInstance.form.setValue({ email: 'envoy@diplomatie.gouv', token: '' });
    submitForm();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('shows a readable message on a 5xx and does not clear the form', () => {
    submit.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    fixture.componentInstance.form.setValue({ email: 'envoy@diplomatie.gouv', token: '' });
    submitForm();

    expect(fixture.nativeElement.textContent).toMatch(/went wrong/i);
    expect(fixture.componentInstance.form.value.email).toBe('envoy@diplomatie.gouv');
    expect(show).not.toHaveBeenCalled();
  });
});
