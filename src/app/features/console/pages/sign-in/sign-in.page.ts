import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../../../shared/ui/button/button';
import { SeoService } from '../../../../core/services/seo.service';
import { ConsoleStore } from '../../services/console-store';
import { ImageFadeInDirective } from '../../../../shared/directives/image-fade-in.directive';

@Component({
  selector: 'app-console-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, Button, NgOptimizedImage, ImageFadeInDirective],
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

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.seo.update({
      title: 'Sign in',
      description: 'Registry Console sign-in.',
      noIndex: true,
    });
  }

  async submit(): Promise<void> {
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
