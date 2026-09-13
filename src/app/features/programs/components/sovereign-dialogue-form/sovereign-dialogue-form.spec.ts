import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { SovereignDialogueForm } from './sovereign-dialogue-form';
import { EngagementService } from '../../../engagement/services/engagement.service';

describe('SovereignDialogueForm', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<SovereignDialogueForm>>;
  let submit: ReturnType<typeof vi.fn>;
  let router: Router;

  beforeEach(async () => {
    submit = vi.fn();
    await TestBed.configureTestingModule({
      imports: [SovereignDialogueForm],
      providers: [provideRouter([]), { provide: EngagementService, useValue: { submit } }],
    }).compileComponents();

    fixture = TestBed.createComponent(SovereignDialogueForm);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('shows a validation error on empty submit without calling the service', () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Email is required.');
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits to EngagementService and navigates to success on valid input', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-2', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.form.setValue({ email: 'delegate@example.org' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      source: 'programs-sovereign-dialogue',
      name: 'delegate@example.org',
      email: 'delegate@example.org',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/success'], {
      queryParams: { ref: 'BB-TEST-2', source: 'programs-sovereign-dialogue' },
    });
  });
});
