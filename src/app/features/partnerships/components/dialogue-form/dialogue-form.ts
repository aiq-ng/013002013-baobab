import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { EngagementService } from '../../../engagement/services/engagement.service';
import { SuccessModalService } from '../../../engagement/services/success-modal.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

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
  private readonly engagementService = inject(EngagementService);
  private readonly successModalService = inject(SuccessModalService);
  private readonly analyticsService = inject(AnalyticsService);

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
      .submit({ source: 'partnerships-dialogue', name: email, email })
      .subscribe((response) => {
        this.analyticsService.trackFormSubmit('partnerships-dialogue');
        this.successModalService.show('partnerships-dialogue', response.referenceId);
        this.form.reset();
      });
  }
}
