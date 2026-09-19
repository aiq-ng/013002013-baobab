import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9()+\-\s]{7,}$/;

function patternValidator(pattern: RegExp, errorKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    return pattern.test(control.value) ? null : { [errorKey]: true };
  };
}

/**
 * Reactive form validators shared by every form on the site (contact, dispatch,
 * classified-access gate) so validation behaves and messages read consistently.
 */
export const baobabValidators = {
  required: Validators.required,
  email: patternValidator(EMAIL_PATTERN, 'email'),
  phone: patternValidator(PHONE_PATTERN, 'phone'),
};

/**
 * Resolves a single human-readable error message for a control, or null when the
 * control has no error worth surfacing yet (untouched/pristine and unsubmitted).
 */
export function errorMessageFor(
  control: AbstractControl | null,
  fieldLabel: string,
): string | null {
  if (!control || !control.errors) {
    return null;
  }
  // Server-side (422) errors are shown as soon as they arrive, regardless of
  // touched/dirty state — the visitor already submitted the form once.
  if (typeof control.errors['server'] === 'string') {
    return control.errors['server'];
  }
  if (!control.touched && !control.dirty) {
    return null;
  }
  if (control.errors['required']) {
    return `${fieldLabel} is required.`;
  }
  if (control.errors['email']) {
    return 'Enter a valid email address.';
  }
  if (control.errors['phone']) {
    return 'Enter a valid phone number.';
  }
  return `${fieldLabel} is invalid.`;
}
