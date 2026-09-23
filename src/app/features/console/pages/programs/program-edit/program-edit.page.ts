import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService } from '../../../../../core/services/seo.service';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../../shared/ui/button/button';
import { ConsoleStore } from '../../../services/console-store';

/**
 * Content-only edit for one of the 6 fixed programs (PROGRAMS EDIT.png).
 * No image upload — this repo has no image-upload infra yet, so the image
 * is shown read-only with a "Current" badge rather than faking one.
 */
@Component({
  selector: 'app-console-program-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './program-edit.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramEditPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(600)]],
  });

  readonly programs = this.store.programs;
  readonly program = computed(() => this.programs().find((p) => p.slug === this.slug) ?? null);

  submitting = false;

  ngOnInit(): void {
    this.seo.update({
      title: 'Edit program',
      description: 'Edit a Secretariat program record.',
      noIndex: true,
    });
    void this.load();
  }

  private async load(): Promise<void> {
    if (this.programs().length === 0) {
      try {
        await this.store.loadPrograms();
      } catch {
        this.toast.error('Could not load the program.');
      }
    }
    const program = this.program();
    if (program) {
      this.form.setValue({ title: program.title, description: program.description });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { title, description } = this.form.getRawValue();
    this.submitting = true;
    try {
      await this.store.saveProgram(this.slug, { title, description });
      this.toast.success('Program updated.');
      await this.router.navigate(['/console/programs']);
    } catch {
      this.toast.error('Could not save the program.');
    } finally {
      this.submitting = false;
    }
  }
}
