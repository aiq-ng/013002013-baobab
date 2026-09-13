import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { EngagementService } from '../../../engagement/services/engagement.service';
import { SuccessModalService } from '../../../engagement/services/success-modal.service';

/**
 * "Confidential Dispatch" email-capture band on a program detail page.
 * Same pattern as the listing's Sovereign Dialogue form, parameterized by
 * per-program heading/subtext/reference code copy.
 */
@Component({
  selector: 'app-confidential-dispatch-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './confidential-dispatch-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfidentialDispatchForm {
  @Input({ required: true }) heading = '';
  @Input({ required: true }) subtext = '';
  @Input({ required: true }) protocolId = '';

  private readonly fb = inject(FormBuilder);
  private readonly engagementService = inject(EngagementService);
  private readonly successModalService = inject(SuccessModalService);

  readonly form = this.fb.nonNullable.group({
    email: ['', [baobabValidators.required, baobabValidators.email]],
  });

  errorFor(controlName: 'email'): string | null {
    return errorMessageFor(this.form.get(controlName), 'Email');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.getRawValue();
    this.engagementService
      .submit({
        source: 'program-confidential-dispatch',
        name: email,
        email,
        metadata: { protocolId: this.protocolId },
      })
      .subscribe((response) => {
        this.successModalService.show('program-confidential-dispatch', response.referenceId);
        this.form.reset();
      });
  }
}
