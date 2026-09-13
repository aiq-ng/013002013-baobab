import { FormControl } from '@angular/forms';
import { baobabValidators, errorMessageFor } from './validators';

describe('baobabValidators.email', () => {
  it('flags an invalid email as invalid', () => {
    const control = new FormControl('not-an-email', baobabValidators.email);
    expect(control.valid).toBe(false);
    expect(control.errors?.['email']).toBe(true);
  });

  it('accepts a valid email', () => {
    const control = new FormControl('ada@example.com', baobabValidators.email);
    expect(control.valid).toBe(true);
  });
});

describe('baobabValidators.phone', () => {
  it('flags letters as invalid', () => {
    const control = new FormControl('call-me', baobabValidators.phone);
    expect(control.valid).toBe(false);
    expect(control.errors?.['phone']).toBe(true);
  });

  it('accepts a phone number with digits, spaces, +, -, ()', () => {
    const control = new FormControl('+1 (555) 123-4567', baobabValidators.phone);
    expect(control.valid).toBe(true);
  });
});

describe('errorMessageFor', () => {
  it('returns a required message', () => {
    const control = new FormControl('', baobabValidators.required);
    control.markAsTouched();
    expect(errorMessageFor(control, 'Email')).toBe('Email is required.');
  });

  it('returns an email format message', () => {
    const control = new FormControl('bad', baobabValidators.email);
    control.markAsTouched();
    expect(errorMessageFor(control, 'Email')).toBe('Enter a valid email address.');
  });

  it('returns a phone format message', () => {
    const control = new FormControl('bad', baobabValidators.phone);
    control.markAsTouched();
    expect(errorMessageFor(control, 'Phone')).toBe('Enter a valid phone number.');
  });

  it('returns null when the control has no errors', () => {
    const control = new FormControl('fine');
    control.markAsTouched();
    expect(errorMessageFor(control, 'Field')).toBeNull();
  });

  it('returns null when the control has errors but has not been touched/dirty', () => {
    const control = new FormControl('', baobabValidators.required);
    expect(errorMessageFor(control, 'Email')).toBeNull();
  });
});
