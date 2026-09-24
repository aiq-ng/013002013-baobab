import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../../../shared/ui/button/button';
import { SeoService } from '../../../../core/services/seo.service';
import { ConsoleStore } from '../../services/console-store';

@Component({
  selector: 'app-console-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, Button, NgOptimizedImage],
  templateUrl: './sign-in.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(ConsoleStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly passwordVisible = signal(false);
  readonly forgotPasswordOpen = signal(false);
  /** Field errors stay hidden until the first submit attempt, then track edits live. */
  private readonly submitAttempted = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly emailError = computed(() => {
    this.formStatus();
    const control = this.form.controls.email;
    if (!this.submitAttempted() || control.valid) return null;
    return control.hasError('required')
      ? 'Enter your email address.'
      : 'Enter a valid email address.';
  });

  readonly passwordError = computed(() => {
    this.formStatus();
    if (!this.submitAttempted() || this.form.controls.password.valid) return null;
    return 'Enter your password.';
  });

  ngOnInit(): void {
    this.seo.update({
      title: 'Sign in',
      description: 'Registry Console sign-in.',
      noIndex: true,
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  toggleForgotPassword(): void {
    this.forgotPasswordOpen.update((open) => !open);
  }

  async submit(): Promise<void> {
    this.submitAttempted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.form.getRawValue();

    try {
      await this.store.signIn(email, password);
      const returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl') ?? '/console/submissions';
      await this.router.navigateByUrl(returnUrl);
    } catch {
      this.errorMessage.set('Incorrect email or password.');
    } finally {
      this.submitting.set(false);
    }
  }
}
