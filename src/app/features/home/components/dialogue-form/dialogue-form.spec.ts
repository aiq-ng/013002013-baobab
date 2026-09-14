import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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
        { provide: EngagementService, useValue: { submit } },
        { provide: SuccessModalService, useValue: { show } },
        { provide: AnalyticsService, useValue: { trackFormSubmit } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogueForm);
    fixture.detectChanges();
  });

  it('shows validation errors on an empty submit without calling the service', () => {
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Name is required.');
    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits to EngagementService and shows the success modal on valid input', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-1', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({ name: 'Amina Diallo', email: 'amina@example.com' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      source: 'home-dialogue',
      name: 'Amina Diallo',
      email: 'amina@example.com',
    });
    expect(show).toHaveBeenCalledWith('home-dialogue', 'BB-TEST-1');
    expect(trackFormSubmit).toHaveBeenCalledWith('home-dialogue');
  });
});
