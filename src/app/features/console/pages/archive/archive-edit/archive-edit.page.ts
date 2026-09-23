import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService } from '../../../../../core/services/seo.service';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../../shared/ui/button/button';
import { ConsoleStore } from '../../../services/console-store';
import { ArchiveCategory } from '../../../models/admin';

const CATEGORIES: ArchiveCategory[] = ['Transhumance', 'Riparian & Water'];

/** Create or edit one Treaties & Conciliation Archive entry. */
@Component({
  selector: 'app-console-archive-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './archive-edit.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveEditPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly categories = CATEGORIES;
  readonly id = this.route.snapshot.paramMap.get('id');
  readonly isNew = this.id === null;

  readonly entries = this.store.archiveEntries;
  readonly entry = computed(() => this.entries().find((e) => e.id === this.id) ?? null);

  readonly form = this.fb.nonNullable.group({
    refCode: ['', [Validators.required, Validators.maxLength(100)]],
    regionTag: ['', [Validators.required, Validators.maxLength(200)]],
    statusTag: ['', [Validators.required, Validators.maxLength(200)]],
    title: ['', [Validators.required, Validators.maxLength(300)]],
    description: ['', [Validators.required, Validators.maxLength(4000)]],
    ratifyingParties: ['', [Validators.required, Validators.maxLength(500)]],
    workingLanguages: ['', [Validators.required, Validators.maxLength(300)]],
    category: this.fb.nonNullable.control<ArchiveCategory>('Transhumance', Validators.required),
  });

  submitting = false;

  ngOnInit(): void {
    this.seo.update({
      title: this.isNew ? 'New archive entry' : 'Edit archive entry',
      description: 'Manage a Treaties & Conciliation Archive entry.',
      noIndex: true,
    });
    void this.load();
  }

  private async load(): Promise<void> {
    if (this.isNew) {
      return;
    }
    if (this.entries().length === 0) {
      try {
        await this.store.loadArchiveEntries();
      } catch {
        this.toast.error('Could not load the entry.');
        return;
      }
    }
    const entry = this.entry();
    if (entry) {
      this.form.setValue({
        refCode: entry.refCode,
        regionTag: entry.regionTag,
        statusTag: entry.statusTag,
        title: entry.title,
        description: entry.description,
        ratifyingParties: entry.ratifyingParties,
        workingLanguages: entry.workingLanguages,
        category: entry.category,
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitting = true;
    try {
      if (this.isNew) {
        await this.store.createArchiveEntry(value);
        this.toast.success('Entry created.');
      } else {
        await this.store.updateArchiveEntry(this.id as string, value);
        this.toast.success('Entry updated.');
      }
      await this.router.navigate(['/console/archive']);
    } catch {
      this.toast.error('Could not save the entry.');
    } finally {
      this.submitting = false;
    }
  }
}
