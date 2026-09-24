import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SAFE_LINK_MESSAGE } from '../../validators/console-validators';

/**
 * Console form field: label + text input (or textarea when `rows` is set) +
 * hint + validation message. Re-renders on any control event, so a parent's
 * `markAllAsTouched()` on submit surfaces errors despite OnPush.
 *
 * Hint and error are tied to the input with `aria-describedby` (rather than
 * a `role="alert"` per field, which would fire a burst of announcements when
 * a whole form is validated at once — the page instead moves focus to the
 * first invalid field).
 */
@Component({
  selector: 'app-console-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './console-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Custom elements are inline by default, which silently drops a parent's space-y-* margins.
  host: { class: 'block' },
})
export class ConsoleField implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) fieldId = '';
  @Input({ required: true }) label = '';
  @Input({ required: true }) control!: FormControl<string>;
  /** Render a textarea with this many rows; 0 renders a single-line input. */
  @Input() rows = 0;
  @Input() placeholder = '';
  @Input() patternMessage = 'Invalid format.';
  /** Message for any custom validator error (defaults to "<label> is invalid."). */
  @Input() invalidMessage: string | null = null;
  @Input() hint = '';
  /** Shows a live "n / max" counter; pair with a matching `Validators.maxLength`. */
  @Input() maxLength: number | null = null;
  @Input() optional = false;
  /** `url` keeps a text input (site paths like /images/… aren't valid `type=url`) with a URL keyboard. */
  @Input() type: 'text' | 'email' | 'url' = 'text';
  @Input() autocomplete = 'off';

  ngOnInit(): void {
    this.control.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }

  get hintId(): string {
    return `${this.fieldId}-hint`;
  }

  get errorId(): string {
    return `${this.fieldId}-error`;
  }

  get describedBy(): string | null {
    const ids = [this.hint ? this.hintId : null, this.error ? this.errorId : null].filter(Boolean);
    return ids.length ? ids.join(' ') : null;
  }

  get length(): number {
    return this.control.value?.length ?? 0;
  }

  get error(): string | null {
    const errors = this.control.errors;
    if (!errors || !this.control.touched) {
      return null;
    }
    if (errors['required']) {
      return `${this.label} is required.`;
    }
    if (errors['maxlength']) {
      return `${this.label} must be ${errors['maxlength'].requiredLength} characters or fewer.`;
    }
    if (errors['safeLink']) {
      return SAFE_LINK_MESSAGE;
    }
    if (errors['pattern']) {
      return this.patternMessage;
    }
    return this.invalidMessage ?? `${this.label} is invalid.`;
  }
}
