import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

/** A site-relative path (`/images/…`, never `//host`) or an absolute https URL. */
const SAFE_LINK = /^(\/(?![/\\])\S*|https:\/\/[^\s/]+\S*)$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validators for everything an editor publishes. Console content lands on the
 * public site, so these are stricter than the built-ins: whitespace isn't
 * content, and a link must be a site path or https — never `javascript:`,
 * `data:` or plain http.
 */
export const consoleValidators = {
  /** `required`, but "   " doesn't count as filled in. */
  notBlank: ((control: AbstractControl): ValidationErrors | null =>
    typeof control.value === 'string' && control.value.trim().length > 0
      ? null
      : { required: true }) as ValidatorFn,

  safeLink: ((control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;
    if (!value) return null;
    return SAFE_LINK.test(value) ? null : { safeLink: true };
  }) as ValidatorFn,

  slug: Validators.pattern(SLUG),
};

export const SAFE_LINK_MESSAGE = 'Use a site path starting with / or an https:// URL.';
