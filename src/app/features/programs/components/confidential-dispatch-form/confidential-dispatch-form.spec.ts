import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ConfidentialDispatchForm } from './confidential-dispatch-form';
import { EngagementService } from '../../../engagement/services/engagement.service';

describe('ConfidentialDispatchForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ConfidentialDispatchForm>>;
  let submit: ReturnType<typeof vi.fn>;
  let router: Router;

  beforeEach(async () => {
    submit = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ConfidentialDispatchForm],
      providers: [provideRouter([]), { provide: EngagementService, useValue: { submit } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfidentialDispatchForm);
    fixture.componentRef.setInput('heading', 'Request Confidential Addenda');
    fixture.componentRef.setInput('subtext', 'Restricted access.');
    fixture.componentRef.setInput('protocolId', 'BB-LCB-702-D');
    router = TestBed.inject(Router);
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

  it('submits to EngagementService with the protocol id in metadata and navigates to success', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-3', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.form.setValue({ email: 'delegate@example.org' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      source: 'program-confidential-dispatch',
      name: 'delegate@example.org',
      email: 'delegate@example.org',
      metadata: { protocolId: 'BB-LCB-702-D' },
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/success'], {
      queryParams: { ref: 'BB-TEST-3', source: 'program-confidential-dispatch' },
    });
  });
});
