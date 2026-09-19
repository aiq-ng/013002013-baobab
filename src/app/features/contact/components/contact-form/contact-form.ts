import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { baobabValidators, errorMessageFor } from '../../../../shared/forms/validators';
import { createEngagementSubmission } from '../../../engagement/services/engagement-submission';

type ContactFormControl = 'firstName' | 'lastName' | 'email' | 'phone' | 'subject' | 'message';

/** The Contact page's main dispatch form → EngagementService, source 'contact-form'. */
@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './contact-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  private readonly fb = inject(FormBuilder);
  private readonly submission = createEngagementSubmission();

  readonly submitting = this.submission.submitting;
  readonly errorMessage = this.submission.errorMessage;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [baobabValidators.required]],
    lastName: ['', [baobabValidators.required]],
    email: ['', [baobabValidators.required, baobabValidators.email]],
    phone: ['', [baobabValidators.phone]],
    subject: ['', [baobabValidators.required]],
    message: ['', [baobabValidators.required]],
  });

  private readonly labels: Record<ContactFormControl, string> = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone number',
    subject: 'Subject',
    message: 'Message',
  };

  errorFor(controlName: ContactFormControl): string | null {
    return errorMessageFor(this.form.get(controlName), this.labels[controlName]);
  }

  submit(): void {
    const { firstName, lastName, email, phone, subject, message } = this.form.getRawValue();
    this.submission.submit(this.form, {
      source: 'contact-form',
      name: `${firstName} ${lastName}`,
      email,
      message,
      metadata: { phone, subject },
    });
  }
}
