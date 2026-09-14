import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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
        { provide: EngagementService, useValue: { submit } },
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

  it('renders the per-program heading, subtext, and protocol id', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Request Confidential Addenda');
    expect(text).toContain('Restricted access.');
    expect(text).toContain('BB-LCB-702-D');
  });

  it('shows a validation error on empty submit without calling the service', () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits to EngagementService with the default source and protocol id in metadata, then shows the success modal', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-3', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({ email: 'delegate@example.org' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      source: 'program-confidential-dispatch',
      name: 'delegate@example.org',
      email: 'delegate@example.org',
      metadata: { protocolId: 'BB-LCB-702-D' },
    });
    expect(show).toHaveBeenCalledWith('program-confidential-dispatch', 'BB-TEST-3');
    expect(trackFormSubmit).toHaveBeenCalledWith('program-confidential-dispatch');
  });

  it('submits with a custom source when provided', () => {
    fixture.componentRef.setInput('source', 'programs-sovereign-dialogue');
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-4', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );

    fixture.componentInstance.form.setValue({ email: 'delegate@example.org' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ source: 'programs-sovereign-dialogue' }),
    );
    expect(show).toHaveBeenCalledWith('programs-sovereign-dialogue', 'BB-TEST-4');
  });
});
