import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService } from '../../../../../core/services/seo.service';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../../shared/ui/button/button';
import { StatusPanel } from '../../../../../shared/ui/status-panel/status-panel';
import { ConsoleStore } from '../../../services/console-store';
import { ConsoleField } from '../../../components/console-field/console-field';
import { PageHeader } from '../../../components/page-header/page-header';
import { SuccessPanel } from '../../../components/success-panel/success-panel';
import { AdminResource } from '../../../models/admin';
import { consoleValidators } from '../../../validators/console-validators';
import { ConsoleFormPage, trimStrings } from '../../../utils/console-form-page';
import { describeApiError } from '../../../utils/api-error';
import { hasPdfSignature } from '../../../utils/pdf-signature';
import { PdfUploadError } from '../../../services/pdf-uploader';
import { formatFileSize } from '../../../utils/format';

const MAX_FILE_BYTES = 25 * 1024 * 1024;

/** Field limits — mirror the backend's resource create/update schemas. */
export const RESOURCE_LIMITS = {
  title: 160,
  batchReference: 40,
} as const;

const text = (max: number) => ['', [consoleValidators.notBlank, Validators.maxLength(max)]];

/**
 * Upload a new resource (RESOURCES EDIT.png → RESOURCES SCUCCESS.png) or edit
 * an existing one: just the PDF, its public name and a batch ID. On edit the
 * PDF is optional — choosing one replaces the current file.
 */
@Component({
  selector: 'app-console-resource-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Button,
    ConsoleField,
    PageHeader,
    SuccessPanel,
    StatusPanel,
  ],
  templateUrl: './resource-edit.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceEditPage extends ConsoleFormPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly limits = RESOURCE_LIMITS;
  readonly id = this.route.snapshot.paramMap.get('id');
  readonly isNew = this.id === null;
  readonly resource = computed(() => this.store.resources().find((r) => r.id === this.id) ?? null);
  readonly loading = signal(!this.isNew);
  readonly notFound = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly published = signal<AdminResource | null>(null);
  readonly dragging = signal(false);
  /** Percent of the PDF sent to Cloudinary, or null when no upload is running. */
  readonly uploadPercent = signal<number | null>(null);

  readonly formatSize = formatFileSize;

  readonly form = this.fb.nonNullable.group({
    title: text(RESOURCE_LIMITS.title),
    batchReference: text(RESOURCE_LIMITS.batchReference),
  });

  readonly file = signal<File | null>(null);
  readonly fileError = signal<string | null>(null);

  protected get trackedForm() {
    return this.form;
  }

  override hasUnsavedChanges(): boolean {
    return this.form.dirty || (this.file() !== null && this.published() === null);
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.isNew ? 'New resource' : 'Edit resource',
      description: 'Manage a published resource document.',
      noIndex: true,
    });
    if (!this.isNew) {
      void this.load();
    }
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(null);
    try {
      if (this.store.resources().length === 0) {
        await this.store.loadResources();
      }
      const resource = this.resource();
      if (!resource) {
        this.notFound.set(true);
        return;
      }
      this.form.reset({ title: resource.title, batchReference: resource.batchReference });
    } catch (error) {
      this.loadError.set(describeApiError(error, 'Could not load the resource.'));
    } finally {
      this.loading.set(false);
    }
  }

  // --- file selection -----------------------------------------------------

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    await this.setFile(input.files?.[0] ?? null);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.dragging.set(false);
    await this.setFile(event.dataTransfer?.files?.[0] ?? null);
  }

  async setFile(file: File | null): Promise<void> {
    this.file.set(file);
    this.fileError.set(await this.validateFile(file));
  }

  private async validateFile(file: File | null): Promise<string | null> {
    if (!file) {
      return this.isNew ? 'A PDF file is required.' : null;
    }
    const namedPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!namedPdf) {
      return 'Only PDF files are accepted.';
    }
    if (file.size > MAX_FILE_BYTES) {
      return `File is too large (${formatFileSize(file.size)}; max 25 MB).`;
    }
    if (!(await hasPdfSignature(file))) {
      return 'This file is not a valid PDF — it may be damaged or renamed from another format.';
    }
    return null;
  }

  // --- submit -------------------------------------------------------------

  async onSubmit(): Promise<void> {
    if (this.submitting()) return;
    if (this.isNew && this.fileError() === null && this.file() === null) {
      this.fileError.set('A PDF file is required.');
    }
    if (this.form.invalid || this.fileError()) {
      this.rejectInvalid();
      return;
    }
    if (this.isNew) {
      await this.publishNew();
    } else {
      await this.saveChanges();
    }
  }

  private onProgress = (percent: number) => this.uploadPercent.set(percent);

  /** Runs one save with upload progress shown, clearing it however it ends. */
  private async withProgress<T>(save: () => Promise<T>): Promise<T> {
    try {
      return await save();
    } finally {
      this.uploadPercent.set(null);
    }
  }

  private describeError(error: unknown, fallback: string): string {
    return error instanceof PdfUploadError ? error.message : describeApiError(error, fallback);
  }

  private async publishNew(): Promise<void> {
    const file = this.file() as File;
    const { title, batchReference } = trimStrings(this.form.getRawValue());
    try {
      let created: AdminResource | null = null;
      await this.guardedSave(async () => {
        created = await this.withProgress(() =>
          this.store.uploadResource(file, title, batchReference, '', this.onProgress),
        );
      });
      this.published.set(created);
    } catch (error) {
      this.toast.error(this.describeError(error, 'Could not upload the resource.'));
    }
  }

  private async saveChanges(): Promise<void> {
    const { title, batchReference } = trimStrings(this.form.getRawValue());
    try {
      await this.guardedSave(() =>
        this.withProgress(async () => {
          await this.store.updateResource(
            this.id as string,
            this.file(),
            title,
            batchReference,
            this.onProgress,
          );
        }),
      );
      this.file.set(null);
      this.toast.success('Resource updated.');
      await this.router.navigate(['/console/resources']);
    } catch (error) {
      this.toast.error(this.describeError(error, 'Could not save the resource.'));
    }
  }

  /** "Upload Another Resource" — a clean form for the next document. */
  startAnother(): void {
    this.published.set(null);
    this.file.set(null);
    this.fileError.set(null);
    this.form.reset();
  }
}
