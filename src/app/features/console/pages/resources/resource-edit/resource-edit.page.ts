import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { formatDate, formatFileSize } from '../../../utils/format';

const MAX_FILE_BYTES = 25 * 1024 * 1024;
/** The backend's codex-details endpoint requires exactly 4 metadata rows. */
const METADATA_ROW_COUNT = 4;

/** Field limits — mirror the backend's resource + codex-details schemas. */
export const RESOURCE_LIMITS = {
  title: 160,
  batchReference: 40,
  batchLabel: 80,
  releaseTag: 80,
  documentDateLabel: 120,
  description: 1000,
  excerptHeading: 160,
  excerptQuote: 1000,
  excerptAttribution: 160,
  onlineUrl: 300,
  metadataLabel: 80,
  metadataValue: 160,
} as const;

const text = (max: number) => ['', [consoleValidators.notBlank, Validators.maxLength(max)]];

/**
 * Upload a new resource PDF with its codex details (RESOURCES EDIT.png →
 * RESOURCES SCUCCESS.png), or edit an existing resource's codex details.
 * The API can't replace a file or rename a resource after upload, so in
 * edit mode those show as read-only context.
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

  readonly formatSize = formatFileSize;
  readonly formatDate = formatDate;

  readonly form = this.fb.nonNullable.group({
    title: text(RESOURCE_LIMITS.title),
    batchReference: text(RESOURCE_LIMITS.batchReference),
    batchLabel: text(RESOURCE_LIMITS.batchLabel),
    releaseTag: text(RESOURCE_LIMITS.releaseTag),
    documentDateLabel: text(RESOURCE_LIMITS.documentDateLabel),
    description: text(RESOURCE_LIMITS.description),
    chapters: ['', [consoleValidators.notBlank]],
    excerptHeading: text(RESOURCE_LIMITS.excerptHeading),
    excerptQuote: text(RESOURCE_LIMITS.excerptQuote),
    excerptAttribution: text(RESOURCE_LIMITS.excerptAttribution),
    onlineUrl: [
      '',
      [
        consoleValidators.notBlank,
        Validators.maxLength(RESOURCE_LIMITS.onlineUrl),
        consoleValidators.safeLink,
      ],
    ],
    metadataRows: this.fb.array(
      Array.from({ length: METADATA_ROW_COUNT }, () =>
        this.fb.nonNullable.group({
          label: text(RESOURCE_LIMITS.metadataLabel),
          value: text(RESOURCE_LIMITS.metadataValue),
          accent: [false],
        }),
      ),
    ),
  });

  get metadataRows(): FormArray<(typeof this.form.controls.metadataRows.controls)[number]> {
    return this.form.controls.metadataRows;
  }

  readonly file = signal<File | null>(null);
  readonly fileError = signal<string | null>(null);

  protected get trackedForm() {
    return this.form;
  }

  override hasUnsavedChanges(): boolean {
    return this.form.dirty || (this.isNew && this.file() !== null && this.published() === null);
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.isNew ? 'New resource' : 'Edit resource',
      description: 'Manage a published resource document.',
      noIndex: true,
    });
    if (!this.isNew) {
      // Title and batch number can't change after upload; only codex details are edited.
      this.form.controls.title.disable();
      this.form.controls.batchReference.disable();
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
      this.form.reset({
        title: resource.title,
        batchReference: resource.batchReference,
        batchLabel: resource.batchLabel,
        releaseTag: resource.releaseTag,
        documentDateLabel: resource.documentDateLabel,
        description: resource.description,
        chapters: resource.chapters.join('\n'),
        excerptHeading: resource.excerptHeading,
        excerptQuote: resource.excerptQuote,
        excerptAttribution: resource.excerptAttribution,
        onlineUrl: resource.onlineUrl,
        metadataRows: Array.from(
          { length: METADATA_ROW_COUNT },
          (_, i) => resource.metadata[i] ?? { label: '', value: '', accent: false },
        ),
      });
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
      return 'A PDF file is required.';
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
    if (this.form.invalid || (this.isNew && this.fileError())) {
      this.rejectInvalid();
      return;
    }
    if (this.isNew) {
      await this.publishNew();
    } else {
      await this.saveDetails();
    }
  }

  private codexDetails() {
    const value = trimStrings(this.form.getRawValue());
    return {
      batchLabel: value.batchLabel,
      releaseTag: value.releaseTag,
      documentDateLabel: value.documentDateLabel,
      description: value.description,
      chapters: value.chapters
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
      excerptHeading: value.excerptHeading,
      excerptQuote: value.excerptQuote,
      excerptAttribution: value.excerptAttribution,
      onlineUrl: value.onlineUrl,
      metadata: value.metadataRows,
    };
  }

  private async publishNew(): Promise<void> {
    const file = this.file() as File;
    const { title, batchReference } = trimStrings(this.form.getRawValue());
    const details = this.codexDetails();
    let created: AdminResource | null = null;
    try {
      await this.guardedSave(async () => {
        created = await this.store.uploadResource(file, title, batchReference, '');
        await this.store.updateResourceCodexDetails(created.id, details);
      });
      this.published.set(created);
    } catch (error) {
      const orphan = created as AdminResource | null;
      if (orphan) {
        await this.quarantine(orphan);
      } else {
        this.toast.error(describeApiError(error, 'Could not upload the resource.'));
      }
    }
  }

  /**
   * The PDF uploaded (and went live) but its codex details didn't save. Take
   * it offline rather than leave a half-described document on the public
   * site, then send the editor to finish it.
   */
  private async quarantine(resource: AdminResource): Promise<void> {
    this.form.markAsPristine();
    this.file.set(null);
    try {
      await this.store.setResourcePublished(resource.id, false);
      this.toast.error(
        "The PDF uploaded but its details didn't save, so it has been kept unpublished. Finish the details below, then publish it from the list.",
      );
    } catch {
      this.toast.error(
        "The PDF uploaded but its details didn't save, and it could not be unpublished automatically. Finish the details below or unpublish it from the list.",
      );
    }
    await this.router.navigate(['/console/resources', resource.id]);
  }

  private async saveDetails(): Promise<void> {
    try {
      await this.guardedSave(() =>
        this.store.updateResourceCodexDetails(this.id as string, this.codexDetails()),
      );
      this.toast.success('Resource details updated.');
      await this.router.navigate(['/console/resources']);
    } catch (error) {
      this.toast.error(describeApiError(error, 'Could not save the resource.'));
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
