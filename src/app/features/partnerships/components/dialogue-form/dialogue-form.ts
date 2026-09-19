import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { createEngagementSubmission } from '../../../engagement/services/engagement-submission';

/**
 * "Initiate Sovereign Partnership Dialogue" email-capture panel — the
 * Partnerships page's primary CTA, source 'partnerships-dialogue'.
 */
@Component({
  selector: 'app-partnerships-dialogue-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './dialogue-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnershipsDialogueForm {
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
    this.submission.submit(this.form, { source: 'partnerships-dialogue', name: email, email });
  }
}
