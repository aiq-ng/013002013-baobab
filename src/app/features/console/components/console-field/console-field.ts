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

/**
 * Console form field: label + text input (or textarea when `rows` is set) +
 * validation message. Re-renders on any control event, so a parent's
 * `markAllAsTouched()` on submit surfaces errors despite OnPush.
 */
@Component({
  selector: 'app-console-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './console-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  ngOnInit(): void {
    this.control.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
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
    if (errors['pattern']) {
      return this.patternMessage;
    }
    return `${this.label} is invalid.`;
  }
}
