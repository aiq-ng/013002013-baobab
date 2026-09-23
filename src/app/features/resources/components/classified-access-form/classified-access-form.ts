import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { createEngagementSubmission } from '../../../engagement/services/engagement-submission';

/**
 * "Track 1.5 Access Gate" classified-access form: institutional enclave
 * identity email (required) + an optional delegation secretarial token →
 * `EngagementService`, then the shared success flow.
 */
@Component({
  selector: 'app-classified-access-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button, FormField],
  templateUrl: './classified-access-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassifiedAccessForm {
  private readonly fb = inject(FormBuilder);
  private readonly submission = createEngagementSubmission();

  readonly submitting = this.submission.submitting;
  readonly errorMessage = this.submission.errorMessage;

  readonly form = this.fb.nonNullable.group({
    email: ['', [baobabValidators.required, baobabValidators.email]],
    token: [''],
  });

  errorFor(controlName: 'email'): string | null {
    return errorMessageFor(this.form.get(controlName), 'Email');
  }

  submit(): void {
    const { email, token } = this.form.getRawValue();
    this.submission.submit(this.form, {
      source: 'resources-classified-access',
      name: email,
      email,
      metadata: token ? { delegationSecretarialToken: token } : {},
    });
  }
}
