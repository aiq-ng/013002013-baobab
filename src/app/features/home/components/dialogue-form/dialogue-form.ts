import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { Button } from '../../../../shared/ui/button/button';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { createEngagementSubmission } from '../../../engagement/services/engagement-submission';

/**
 * Inline "Initiate Dialogue" email-capture form for the Home closing CTA band.
 * Rendered by the parent page only once the CTA is pressed (progressive disclosure,
 * not a modal/popup).
 */
@Component({
  selector: 'app-dialogue-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormField, Button],
  templateUrl: './dialogue-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogueForm {
  private readonly fb = inject(FormBuilder);
  private readonly submission = createEngagementSubmission();

  readonly submitting = this.submission.submitting;
  readonly errorMessage = this.submission.errorMessage;

  readonly form = this.fb.nonNullable.group({
    name: ['', baobabValidators.required],
    email: ['', [baobabValidators.required, baobabValidators.email]],
  });

  errorFor(controlName: 'name' | 'email'): string | null {
    const label = controlName === 'name' ? 'Name' : 'Email';
    return errorMessageFor(this.form.get(controlName), label);
  }

  submit(): void {
    const { name, email } = this.form.getRawValue();
    this.submission.submit(this.form, { source: 'home-dialogue', name, email });
  }
}
