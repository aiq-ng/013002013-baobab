import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { Button } from '../../../../shared/ui/button/button';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { EngagementService } from '../../../engagement/services/engagement.service';
import { SuccessModalService } from '../../../engagement/services/success-modal.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

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
  private readonly engagementService = inject(EngagementService);
  private readonly successModalService = inject(SuccessModalService);
  private readonly analyticsService = inject(AnalyticsService);

  readonly form = this.fb.nonNullable.group({
    name: ['', baobabValidators.required],
    email: ['', [baobabValidators.required, baobabValidators.email]],
  });

  errorFor(controlName: 'name' | 'email'): string | null {
    const label = controlName === 'name' ? 'Name' : 'Email';
    return errorMessageFor(this.form.get(controlName), label);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email } = this.form.getRawValue();
    this.engagementService
      .submit({ source: 'home-dialogue', name, email })
      .subscribe((response) => {
        this.analyticsService.trackFormSubmit('home-dialogue');
        this.successModalService.show('home-dialogue', response.referenceId);
        this.form.reset();
      });
  }
}
