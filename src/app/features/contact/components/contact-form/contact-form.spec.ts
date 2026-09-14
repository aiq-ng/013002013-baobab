import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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

  beforeEach(async () => {
    submit = vi.fn();
    show = vi.fn();
    trackFormSubmit = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ContactForm],
      providers: [
        { provide: EngagementService, useValue: { submit } },
        { provide: SuccessModalService, useValue: { show } },
        { provide: AnalyticsService, useValue: { trackFormSubmit } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the Mediate, Stabilize, Resolve panel copy', () => {
    expect(fixture.nativeElement.textContent).toContain('Mediate,');
    expect(fixture.nativeElement.textContent).toContain('Stabilize, Resolve.');
  });

  it('shows validation errors and does not submit when required fields are empty', () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('First name is required.');
    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits via EngagementService and shows the success modal with source contact-form', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BG-2026-0847', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({
      firstName: 'Amina',
      lastName: 'Diallo',
      email: 'amina@mfa.gov',
      phone: '+221 77 000 00 00',
      subject: 'Bilateral mediation inquiry',
      message: 'Requesting a Track 1.5 dialogue on border security.',
    });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      source: 'contact-form',
      name: 'Amina Diallo',
      email: 'amina@mfa.gov',
      message: 'Requesting a Track 1.5 dialogue on border security.',
      metadata: { phone: '+221 77 000 00 00', subject: 'Bilateral mediation inquiry' },
    });
    expect(show).toHaveBeenCalledWith('contact-form', 'BG-2026-0847');
    expect(trackFormSubmit).toHaveBeenCalledWith('contact-form');
  });
});
