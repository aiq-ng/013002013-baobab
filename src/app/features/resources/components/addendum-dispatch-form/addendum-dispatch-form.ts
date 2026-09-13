import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from '../../../../shared/ui/button/button';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { EngagementService } from '../../../engagement/services/engagement.service';

/**
 * "Sovereign Addendum Dispatch" email-capture card next to the featured
 * document, one of the site's 5 email-capture CTAs → shared success flow.
 */
@Component({
  selector: 'app-addendum-dispatch-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './addendum-dispatch-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddendumDispatchForm {
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
      .submit({ source: 'resources-addendum', name: email, email })
      .subscribe((response) => {
        this.router.navigate(['/success'], {
          queryParams: { ref: response.referenceId, source: 'resources-addendum' },
        });
      });
  }
}
