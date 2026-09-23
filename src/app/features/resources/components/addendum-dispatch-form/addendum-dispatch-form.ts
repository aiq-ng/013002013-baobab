import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { createEngagementSubmission } from '../../../engagement/services/engagement-submission';

/**
 * "Sovereign Addendum Dispatch" email-capture card next to the featured
 * document, one of the site's email-capture CTAs → shared success flow.
 */
@Component({
  selector: 'app-addendum-dispatch-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button, FormField],
  templateUrl: './addendum-dispatch-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddendumDispatchForm {
  private readonly fb = inject(FormBuilder);
  private readonly submission = createEngagementSubmission();

  readonly submitting = this.submission.submitting;
  readonly errorMessage = this.submission.errorMessage;

  readonly form = this.fb.nonNullable.group({
    email: ['', [baobabValidators.required, baobabValidators.email]],
  });

  errorFor(controlName: 'email'): string | null {
    return errorMessageFor(this.form.get(controlName), 'Email');
  }

  submit(): void {
    const { email } = this.form.getRawValue();
    this.submission.submit(this.form, { source: 'resources-addendum', name: email, email });
  }
}
