import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { PartnershipsDialogueForm } from './dialogue-form';
import { EngagementService } from '../../../engagement/services/engagement.service';
import { SuccessModalService } from '../../../engagement/services/success-modal.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

describe('PartnershipsDialogueForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<PartnershipsDialogueForm>>;
  let submit: ReturnType<typeof vi.fn>;
  let show: ReturnType<typeof vi.fn>;
  let trackFormSubmit: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    submit = vi.fn();
    show = vi.fn();
    trackFormSubmit = vi.fn();
    await TestBed.configureTestingModule({
      imports: [PartnershipsDialogueForm],
      providers: [
        {
          provide: EngagementService,
          useValue: { submit, generateIdempotencyKey: () => 'key-1' },
        },
        { provide: SuccessModalService, useValue: { show } },
        { provide: AnalyticsService, useValue: { trackFormSubmit } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnershipsDialogueForm);
    fixture.detectChanges();
  });

  function submitForm() {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows a validation error and does not submit when the email is invalid', () => {
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits via EngagementService and shows the success modal with source partnerships-dialogue', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BG-2026-0847', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({ email: 'envoy@mfa.gov' });
    submitForm();

    expect(submit).toHaveBeenCalledWith(
      { source: 'partnerships-dialogue', name: 'envoy@mfa.gov', email: 'envoy@mfa.gov' },
      'key-1',
    );
    expect(show).toHaveBeenCalledWith('partnerships-dialogue', 'BG-2026-0847');
    expect(trackFormSubmit).toHaveBeenCalledWith('partnerships-dialogue');
  });

  it('disables the submit button while pending', () => {
    const subject = new Subject<{ referenceId: string; submittedAt: string }>();
    submit.mockReturnValue(subject.asObservable());

    fixture.componentInstance.form.setValue({ email: 'envoy@mfa.gov' });
    submitForm();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('maps a 422 email error onto the email field', () => {
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

    fixture.componentInstance.form.setValue({ email: 'envoy@mfa.gov' });
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('value is not a valid email address');
    expect(show).not.toHaveBeenCalled();
  });
});
