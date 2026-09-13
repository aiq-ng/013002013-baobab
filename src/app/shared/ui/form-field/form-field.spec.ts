import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormField } from './form-field';

describe('FormField', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [FormField] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(FormField);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the label associated with the given inputId', () => {
    const fixture = TestBed.createComponent(FormField);
    fixture.componentInstance.label = 'Email';
    fixture.componentInstance.inputId = 'email-field';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.textContent).toContain('Email');
    expect(label.attributes['for']).toBe('email-field');
  });

  it('shows the error message with role="alert" when errorMessage is set', () => {
    const fixture = TestBed.createComponent(FormField);
    fixture.componentInstance.label = 'Email';
    fixture.componentInstance.errorMessage = 'Enter a valid email address.';
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(alert).toBeTruthy();
    expect(alert.nativeElement.textContent).toContain('Enter a valid email address.');
  });

  it('renders no alert when errorMessage is null', () => {
    const fixture = TestBed.createComponent(FormField);
    fixture.componentInstance.label = 'Email';
    fixture.componentInstance.errorMessage = null;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[role="alert"]'))).toBeFalsy();
  });
});
