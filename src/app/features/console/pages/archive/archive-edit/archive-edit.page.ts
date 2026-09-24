import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../../../../core/services/seo.service';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../../shared/ui/button/button';
import { StatusPanel } from '../../../../../shared/ui/status-panel/status-panel';
import { ConsoleStore } from '../../../services/console-store';
import { ConsoleField } from '../../../components/console-field/console-field';
import { PageHeader } from '../../../components/page-header/page-header';
import { ArchiveCategory } from '../../../models/admin';
import { consoleValidators } from '../../../validators/console-validators';
import { ConsoleFormPage, trimStrings } from '../../../utils/console-form-page';
import { describeApiError } from '../../../utils/api-error';

const CATEGORIES: ArchiveCategory[] = ['Transhumance', 'Riparian & Water'];

/** Field limits — mirror the backend's ArchiveEntryWrite schema. */
export const ARCHIVE_LIMITS = {
  refCode: 100,
  regionTag: 200,
  statusTag: 200,
  title: 300,
  description: 4000,
  ratifyingParties: 500,
  workingLanguages: 300,
} as const;

const text = (max: number) => ['', [consoleValidators.notBlank, Validators.maxLength(max)]];

/** Create or edit one Treaties & Conciliation Archive entry. */
@Component({
  selector: 'app-console-archive-edit',
  standalone: true,
  imports: [ReactiveFormsModule, Button, ConsoleField, PageHeader, StatusPanel],
  templateUrl: './archive-edit.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveEditPage extends ConsoleFormPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly categories = CATEGORIES;
  readonly limits = ARCHIVE_LIMITS;
  readonly id = this.route.snapshot.paramMap.get('id');
  readonly isNew = this.id === null;

  readonly entries = this.store.archiveEntries;
  readonly entry = computed(() => this.entries().find((e) => e.id === this.id) ?? null);
  readonly loading = signal(!this.isNew);
  readonly notFound = signal(false);
  readonly loadError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    refCode: text(ARCHIVE_LIMITS.refCode),
    regionTag: text(ARCHIVE_LIMITS.regionTag),
    statusTag: text(ARCHIVE_LIMITS.statusTag),
    title: text(ARCHIVE_LIMITS.title),
    description: text(ARCHIVE_LIMITS.description),
    ratifyingParties: text(ARCHIVE_LIMITS.ratifyingParties),
    workingLanguages: text(ARCHIVE_LIMITS.workingLanguages),
    category: this.fb.nonNullable.control<ArchiveCategory>('Transhumance', Validators.required),
  });

  protected get trackedForm() {
    return this.form;
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.isNew ? 'New archive entry' : 'Edit archive entry',
      description: 'Manage a Treaties & Conciliation Archive entry.',
      noIndex: true,
    });
    void this.load();
  }

  async load(): Promise<void> {
    if (this.isNew) {
      return;
    }
    this.loading.set(true);
    this.loadError.set(null);
    try {
      if (this.entries().length === 0) {
        await this.store.loadArchiveEntries();
      }
      const entry = this.entry();
      if (!entry) {
        this.notFound.set(true);
        return;
      }
      this.form.reset({
        refCode: entry.refCode,
        regionTag: entry.regionTag,
        statusTag: entry.statusTag,
        title: entry.title,
        description: entry.description,
        ratifyingParties: entry.ratifyingParties,
        workingLanguages: entry.workingLanguages,
        category: entry.category,
      });
    } catch (error) {
      this.loadError.set(describeApiError(error, 'Could not load the entry.'));
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.submitting()) return;
    if (this.form.invalid) {
      this.rejectInvalid();
      return;
    }
    const value = trimStrings(this.form.getRawValue());
    try {
      await this.guardedSave(async () => {
        if (this.isNew) {
          await this.store.createArchiveEntry(value);
        } else {
          await this.store.updateArchiveEntry(this.id as string, value);
        }
      });
      this.toast.success(this.isNew ? 'Entry created.' : 'Entry updated.');
      await this.router.navigate(['/console/archive']);
    } catch (error) {
      this.toast.error(describeApiError(error, 'Could not save the entry.'));
    }
  }
}
