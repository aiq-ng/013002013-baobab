import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PartnershipsDialogueForm } from './dialogue-form';
import { EngagementService } from '../../../engagement/services/engagement.service';
import { SuccessModalService } from '../../../engagement/services/success-modal.service';

describe('PartnershipsDialogueForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<PartnershipsDialogueForm>>;
  let submit: ReturnType<typeof vi.fn>;
  let show: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    submit = vi.fn();
    show = vi.fn();
    await TestBed.configureTestingModule({
      imports: [PartnershipsDialogueForm],
      providers: [
        { provide: EngagementService, useValue: { submit } },
        { provide: SuccessModalService, useValue: { show } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnershipsDialogueForm);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows a validation error and does not submit when the email is invalid', () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits via EngagementService and shows the success modal with source partnerships-dialogue', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BG-2026-0847', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({ email: 'envoy@mfa.gov' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      source: 'partnerships-dialogue',
      name: 'envoy@mfa.gov',
      email: 'envoy@mfa.gov',
    });
    expect(show).toHaveBeenCalledWith('partnerships-dialogue', 'BG-2026-0847');
  });
});
