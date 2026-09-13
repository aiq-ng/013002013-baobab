import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from '../../../../shared/ui/button/button';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { EngagementService } from '../../../engagement/services/engagement.service';

/**
 * "Sovereign Dialogue" email-capture band on the Programs listing page
 * ("Receive Verified Field Dispatches & Bi-Weekly Corridor Updates").
 */
@Component({
  selector: 'app-sovereign-dialogue-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './sovereign-dialogue-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SovereignDialogueForm {
  private readonly fb = inject(FormBuilder);
  private readonly engagementService = inject(EngagementService);
  private readonly router = inject(Router);

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
      .submit({ source: 'programs-sovereign-dialogue', name: email, email })
      .subscribe((response) => {
        this.router.navigate(['/success'], {
          queryParams: { ref: response.referenceId, source: 'programs-sovereign-dialogue' },
        });
      });
  }
}
