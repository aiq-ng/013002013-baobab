import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ContactForm } from './contact-form';
import { EngagementService } from '../../../engagement/services/engagement.service';
import { SuccessModalService } from '../../../engagement/services/success-modal.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

describe('ContactForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ContactForm>>;
  let submit: ReturnType<typeof vi.fn>;
  let show: ReturnType<typeof vi.fn>;
  let trackFormSubmit: ReturnType<typeof vi.fn>;

  const validValue = {
    firstName: 'Amina',
    lastName: 'Diallo',
    email: 'amina@mfa.gov',
    phone: '+221 77 000 00 00',
    subject: 'Bilateral mediation inquiry',
    message: 'Requesting a Track 1.5 dialogue on border security.',
  };

  beforeEach(async () => {
    submit = vi.fn();
    show = vi.fn();
    trackFormSubmit = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [
        {
          provide: EngagementService,
          useValue: { submit, generateIdempotencyKey: () => 'key-1' },
        },
        { provide: SuccessModalService, useValue: { show } },
        { provide: AnalyticsService, useValue: { trackFormSubmit } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    fixture.detectChanges();
  });

  function submitForm() {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the Mediate, Stabilize, Resolve panel copy', () => {
    expect(fixture.nativeElement.textContent).toContain('Mediate,');
    expect(fixture.nativeElement.textContent).toContain('Stabilize, Resolve.');
  });

  it('shows validation errors and does not submit when required fields are empty', () => {
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('First name is required.');
    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits via EngagementService and shows the success modal with source contact-form', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BG-2026-0847', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue(validValue);
    submitForm();

    expect(submit).toHaveBeenCalledWith(
      {
        source: 'contact-form',
        name: 'Amina Diallo',
        email: 'amina@mfa.gov',
        message: 'Requesting a Track 1.5 dialogue on border security.',
        metadata: { phone: '+221 77 000 00 00', subject: 'Bilateral mediation inquiry' },
      },
      'key-1',
    );
    expect(show).toHaveBeenCalledWith('contact-form', 'BG-2026-0847');
    expect(trackFormSubmit).toHaveBeenCalledWith('contact-form');
  });

  it('disables the submit button while the request is pending', () => {
    const subject = new Subject<{ referenceId: string; submittedAt: string }>();
    submit.mockReturnValue(subject.asObservable());

    fixture.componentInstance.form.setValue(validValue);
    submitForm();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);

    subject.next({ referenceId: 'BB-1', submittedAt: '2026-01-01T00:00:00.000Z' });
    subject.complete();
    fixture.detectChanges();

    expect(button.disabled).toBe(false);
  });

  it('maps a 422 email error from the server onto the email field', () => {
    submit.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 422,
            error: {
              detail: [{ loc: ['body', 'email'], msg: 'value is not a valid email address' }],
            },
          }),
      ),
    );

    fixture.componentInstance.form.setValue(validValue);
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('value is not a valid email address');
    expect(show).not.toHaveBeenCalled();
  });

  it('shows a readable message and does not clear the form on a 429', () => {
    submit.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 429, error: { detail: 'slow down' } })),
    );

    fixture.componentInstance.form.setValue(validValue);
    submitForm();

    expect(fixture.nativeElement.textContent).toMatch(/too many requests/i);
    expect(fixture.componentInstance.form.value.email).toBe('amina@mfa.gov');
    expect(show).not.toHaveBeenCalled();
  });
});
