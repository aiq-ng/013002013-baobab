import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AddendumDispatchForm } from './addendum-dispatch-form';
import { EngagementService } from '../../../engagement/services/engagement.service';

describe('AddendumDispatchForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<AddendumDispatchForm>>;
  let submit: ReturnType<typeof vi.fn>;
  let router: Router;

  beforeEach(async () => {
    submit = vi.fn();
    await TestBed.configureTestingModule({
      imports: [AddendumDispatchForm],
      providers: [provideRouter([]), { provide: EngagementService, useValue: { submit } }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddendumDispatchForm);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('shows a validation error on empty submit without calling the service', () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('shows an invalid-email message for a malformed address', () => {
    fixture.componentInstance.form.setValue({ email: 'not-an-email' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Enter a valid email address.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits to EngagementService and navigates to success on valid input', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-3', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.form.setValue({ email: 'desk-officer@mfa.gov' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      source: 'resources-addendum',
      name: 'desk-officer@mfa.gov',
      email: 'desk-officer@mfa.gov',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/success'], {
      queryParams: { ref: 'BB-TEST-3', source: 'resources-addendum' },
    });
  });
});
