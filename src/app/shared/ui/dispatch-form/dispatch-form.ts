import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../button/button';
import { baobabValidators, errorMessageFor } from '../../forms/validators';
import { createEngagementSubmission } from '../../../features/engagement/services/engagement-submission';
import { EngagementSource } from '../../../core/models/engagement-request';

export type DispatchFormVariant = 'dispatch' | 'subscribe';

/**
 * Shared email-capture band. `dispatch` is the full "Diplomatic Dispatches"
 * version (program detail pages); `subscribe` is the simpler "Stay informed"
 * newsletter version (Programs listing).
 */
@Component({
  selector: 'app-dispatch-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './dispatch-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DispatchForm {
  @Input({ required: true }) heading = '';
  @Input() subtext = '';
  @Input({ required: true }) protocolId = '';
  @Input() variant: DispatchFormVariant = 'dispatch';
  @Input() source: EngagementSource = 'program-confidential-dispatch';

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
    this.submission.submit(this.form, {
      source: this.source,
      name: email,
      email,
      metadata: { protocolId: this.protocolId },
    });
  }
}
