import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { DialogueForm } from './dialogue-form';
import { EngagementService } from '../../../engagement/services/engagement.service';

describe('DialogueForm', () => {
  let fixture: ComponentFixture<DialogueForm>;
  let submit: ReturnType<typeof vi.fn>;
  let router: Router;

  beforeEach(async () => {
    submit = vi.fn();

    await TestBed.configureTestingModule({
      imports: [DialogueForm],
      providers: [provideRouter([]), { provide: EngagementService, useValue: { submit } }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogueForm);
    router = TestBed.inject(Router);
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

  it('submits to EngagementService and navigates to success on valid input', () => {
    submit.mockReturnValue(
      of({ referenceId: 'BB-TEST-1', submittedAt: '2026-01-01T00:00:00.000Z' }),
    );
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.componentInstance.form.setValue({ name: 'Amina Diallo', email: 'amina@example.com' });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      source: 'home-dialogue',
      name: 'Amina Diallo',
      email: 'amina@example.com',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/success'], {
      queryParams: { ref: 'BB-TEST-1', source: 'home-dialogue' },
    });
  });
});
