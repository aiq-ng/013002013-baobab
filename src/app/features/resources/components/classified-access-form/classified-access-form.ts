import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from '../../../../shared/ui/button/button';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { EngagementService } from '../../../engagement/services/engagement.service';

/**
 * "Track 1.5 Access Gate" classified-access form: institutional enclave
 * identity email (required) + an optional delegation secretarial token →
 * `EngagementService`, then the shared success flow.
 */
@Component({
  selector: 'app-classified-access-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './classified-access-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassifiedAccessForm {
  private readonly fb = inject(FormBuilder);
  private readonly engagementService = inject(EngagementService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [baobabValidators.required, baobabValidators.email]],
    token: [''],
  });

  errorFor(controlName: 'email'): string | null {
    return errorMessageFor(this.form.get(controlName), 'Email');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, token } = this.form.getRawValue();
    this.engagementService
      .submit({
        source: 'resources-classified-access',
        name: email,
        email,
        metadata: token ? { delegationSecretarialToken: token } : {},
      })
      .subscribe((response) => {
        this.router.navigate(['/success'], {
          queryParams: { ref: response.referenceId, source: 'resources-classified-access' },
        });
      });
  }
}
