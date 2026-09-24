import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { DispatchForm } from './dispatch-form';
import { EngagementService } from '../../../features/engagement/services/engagement.service';
import { SuccessModalService } from '../../../features/engagement/services/success-modal.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

describe('DispatchForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<DispatchForm>>;
  let submit: ReturnType<typeof vi.fn>;
  let show: ReturnType<typeof vi.fn>;
  let trackFormSubmit: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    submit = vi.fn();
    show = vi.fn();
    trackFormSubmit = vi.fn();
    await TestBed.configureTestingModule({
      imports: [DispatchForm],
      providers: [
        {
          provide: EngagementService,
          useValue: { submit, generateIdempotencyKey: () => 'key-1' },
        },
        { provide: SuccessModalService, useValue: { show } },
        { provide: AnalyticsService, useValue: { trackFormSubmit } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DispatchForm);
    fixture.componentRef.setInput('heading', 'Request Confidential Addenda');
    fixture.componentRef.setInput('subtext', 'Restricted access.');
    fixture.componentRef.setInput('protocolId', 'BB-LCB-702-D');
    fixture.detectChanges();
  });

  function submitForm() {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('renders the per-program heading, subtext, and protocol id', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Request Confidential Addenda');
    expect(text).toContain('Restricted access.');
    expect(text).toContain('BB-LCB-702-D');
  });

  it('shows a validation error on empty submit without calling the service', () => {
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits to EngagementService with the default source and protocol id in metadata, then shows the success modal', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-3', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({ email: 'delegate@example.org' });
    submitForm();

    expect(submit).toHaveBeenCalledWith(
      {
        source: 'program-confidential-dispatch',
        name: 'delegate@example.org',
        email: 'delegate@example.org',
        metadata: { protocolId: 'BB-LCB-702-D' },
      },
      'key-1',
    );
    expect(show).toHaveBeenCalledWith('program-confidential-dispatch', 'BB-TEST-3');
    expect(trackFormSubmit).toHaveBeenCalledWith('program-confidential-dispatch');
  });

  it('submits with a custom source when provided', () => {
    fixture.componentRef.setInput('source', 'programs-sovereign-dialogue');
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-4', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({ email: 'delegate@example.org' });
    submitForm();

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'programs-sovereign-dialogue' }),
      'key-1',
    );
    expect(show).toHaveBeenCalledWith('programs-sovereign-dialogue', 'BB-TEST-4');
  });

  it('disables the submit button while pending', () => {
    const subject = new Subject<{ referenceId: string; submittedAt: string }>();
    submit.mockReturnValue(subject.asObservable());

    fixture.componentInstance.form.setValue({ email: 'delegate@example.org' });
    submitForm();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('shows a readable message on a 5xx and does not open the success modal', () => {
    submit.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    fixture.componentInstance.form.setValue({ email: 'delegate@example.org' });
    submitForm();

    expect(fixture.nativeElement.textContent).toMatch(/went wrong/i);
    expect(show).not.toHaveBeenCalled();
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

    fixture.componentInstance.form.setValue({ email: 'delegate@example.org' });
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('value is not a valid email address');
    expect(show).not.toHaveBeenCalled();
  });
});
