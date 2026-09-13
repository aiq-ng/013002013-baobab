import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Label + projected input + validation-error slot, shared by every form on the
 * site (contact, dispatch, classified-access gate) for consistent a11y and styling.
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  @Input({ required: true }) label = '';
  @Input({ required: true }) inputId = '';
  @Input() errorMessage: string | null = null;
}
