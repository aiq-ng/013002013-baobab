import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SeoService } from '../../../../../core/services/seo.service';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../../shared/ui/button/button';
import { ConsoleStore } from '../../../services/console-store';

const MAX_FILE_BYTES = 25 * 1024 * 1024;
/** The backend's codex-details endpoint requires exactly 4 metadata rows. */
const METADATA_ROW_COUNT = 4;

/** Upload a new published resource PDF (RESOURCES EDIT.png). */
@Component({
  selector: 'app-console-resource-new',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './resource-new.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceNewPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(160)]],
    batchReference: ['', [Validators.required, Validators.maxLength(40)]],
    batchLabel: ['', [Validators.required, Validators.maxLength(80)]],
    releaseTag: ['', [Validators.required, Validators.maxLength(80)]],
    documentDateLabel: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    chapters: ['', [Validators.required]],
    excerptHeading: ['', [Validators.required, Validators.maxLength(160)]],
    excerptQuote: ['', [Validators.required, Validators.maxLength(1000)]],
    excerptAttribution: ['', [Validators.required, Validators.maxLength(160)]],
    onlineUrl: ['', [Validators.required, Validators.maxLength(300)]],
    metadataRows: this.fb.array(
      Array.from({ length: METADATA_ROW_COUNT }, () =>
        this.fb.nonNullable.group({
          label: ['', [Validators.required, Validators.maxLength(80)]],
          value: ['', [Validators.required, Validators.maxLength(160)]],
          accent: [false],
        }),
      ),
    ),
  });

  get metadataRows(): FormArray {
    return this.form.controls.metadataRows;
  }

  readonly file = signal<File | null>(null);
  readonly fileError = signal<string | null>(null);
  submitting = false;

  ngOnInit(): void {
    this.seo.update({
      title: 'New resource',
      description: 'Upload a new published resource document.',
      noIndex: true,
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = input.files?.[0] ?? null;
    this.setFile(selected);
  }

  setFile(file: File | null): void {
    this.file.set(file);
    this.fileError.set(this.validateFile(file));
  }

  private validateFile(file: File | null): string | null {
    if (!file) {
      return 'A PDF file is required.';
    }
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return 'Only PDF files are accepted.';
    }
    if (file.size > MAX_FILE_BYTES) {
      return 'File is too large (max 25 MB).';
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    this.fileError.set(this.validateFile(this.file()));
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
    if (this.fileError() || this.form.invalid) {
      return;
    }

    const file = this.file();
    if (!file) {
      return;
    }

    const {
      title,
      batchReference,
      batchLabel,
      releaseTag,
      documentDateLabel,
      description,
      chapters,
      excerptHeading,
      excerptQuote,
      excerptAttribution,
      onlineUrl,
      metadataRows,
    } = this.form.getRawValue();

    this.submitting = true;
    try {
      const created = await this.store.uploadResource(file, title, batchReference, '');
      await this.store.updateResourceCodexDetails(created.id, {
        batchLabel,
        releaseTag,
        documentDateLabel,
        description,
        chapters: chapters
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
        excerptHeading,
        excerptQuote,
        excerptAttribution,
        onlineUrl,
        metadata: metadataRows,
      });
      this.toast.success('Resource published.');
      await this.router.navigate(['/console/resources']);
    } catch {
      this.toast.error('Could not upload the resource.');
    } finally {
      this.submitting = false;
    }
  }
}
