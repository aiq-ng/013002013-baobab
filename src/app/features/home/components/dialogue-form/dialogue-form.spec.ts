import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { DialogueForm } from './dialogue-form';
import { EngagementService } from '../../../engagement/services/engagement.service';
import { SuccessModalService } from '../../../engagement/services/success-modal.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

describe('DialogueForm', () => {
  let fixture: ComponentFixture<DialogueForm>;
  let submit: ReturnType<typeof vi.fn>;
  let show: ReturnType<typeof vi.fn>;
  let trackFormSubmit: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    submit = vi.fn();
    show = vi.fn();
    trackFormSubmit = vi.fn();

    await TestBed.configureTestingModule({
      imports: [DialogueForm],
      providers: [
        {
          provide: EngagementService,
          useValue: { submit, generateIdempotencyKey: () => 'key-1' },
        },
        { provide: SuccessModalService, useValue: { show } },
        { provide: AnalyticsService, useValue: { trackFormSubmit } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogueForm);
    fixture.detectChanges();
  });

  function submitForm() {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('shows validation errors on an empty submit without calling the service', () => {
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('Name is required.');
    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits to EngagementService and shows the success modal on valid input', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-1', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({ name: 'Amina Diallo', email: 'amina@example.com' });
    submitForm();

    expect(submit).toHaveBeenCalledWith(
      { source: 'home-dialogue', name: 'Amina Diallo', email: 'amina@example.com' },
      'key-1',
    );
    expect(show).toHaveBeenCalledWith('home-dialogue', 'BB-TEST-1');
    expect(trackFormSubmit).toHaveBeenCalledWith('home-dialogue');
  });

  it('disables the submit button while pending and re-enables on success', () => {
    const subject = new Subject<{ referenceId: string; submittedAt: string }>();
    submit.mockReturnValue(subject.asObservable());

    fixture.componentInstance.form.setValue({ name: 'Amina Diallo', email: 'amina@example.com' });
    submitForm();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);

    subject.next({ referenceId: 'BB-1', submittedAt: '2026-01-01T00:00:00.000Z' });
    subject.complete();
    fixture.detectChanges();

    expect(button.disabled).toBe(false);
  });

  it('shows a readable message for a 5xx and keeps the form filled', () => {
    submit.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    fixture.componentInstance.form.setValue({ name: 'Amina Diallo', email: 'amina@example.com' });
    submitForm();

    expect(fixture.nativeElement.textContent).toMatch(/went wrong/i);
    expect(fixture.componentInstance.form.value.email).toBe('amina@example.com');
    expect(show).not.toHaveBeenCalled();
  });
});
