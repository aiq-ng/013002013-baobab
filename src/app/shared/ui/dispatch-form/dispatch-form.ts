import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../button/button';
import { baobabValidators, errorMessageFor } from '../../forms/validators';
import { EngagementService } from '../../../features/engagement/services/engagement.service';
import { SuccessModalService } from '../../../features/engagement/services/success-modal.service';
import { EngagementSource } from '../../../core/models/engagement-request';

/**
 * Shared "Diplomatic Dispatches" email-capture band, used wherever the design
 * repeats this pattern (Programs listing and program detail pages).
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
  @Input({ required: true }) subtext = '';
  @Input({ required: true }) protocolId = '';
  @Input() source: EngagementSource = 'program-confidential-dispatch';

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
        source: this.source,
        name: email,
        email,
        metadata: { protocolId: this.protocolId },
      })
      .subscribe((response) => {
        this.successModalService.show(this.source, response.referenceId);
        this.form.reset();
      });
  }
}
