import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ClassifiedAccessForm } from './classified-access-form';
import { EngagementService } from '../../../engagement/services/engagement.service';

describe('ClassifiedAccessForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ClassifiedAccessForm>>;
  let submit: ReturnType<typeof vi.fn>;
  let router: Router;

  beforeEach(async () => {
    submit = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ClassifiedAccessForm],
      providers: [provideRouter([]), { provide: EngagementService, useValue: { submit } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassifiedAccessForm);
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
    fixture.componentInstance.form.setValue({ email: 'nope', token: '' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Enter a valid email address.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits without requiring the optional secretarial token', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-4', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.form.setValue({ email: 'envoy@diplomatie.gouv', token: '' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      source: 'resources-classified-access',
      name: 'envoy@diplomatie.gouv',
      email: 'envoy@diplomatie.gouv',
      metadata: {},
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/success'], {
      queryParams: { ref: 'BB-TEST-4', source: 'resources-classified-access' },
    });
  });

  it('passes the secretarial token as metadata when provided', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-5', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.form.setValue({
      email: 'envoy@diplomatie.gouv',
      token: 'secret-token',
    });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      source: 'resources-classified-access',
      name: 'envoy@diplomatie.gouv',
      email: 'envoy@diplomatie.gouv',
      metadata: { delegationSecretarialToken: 'secret-token' },
    });
  });
});
