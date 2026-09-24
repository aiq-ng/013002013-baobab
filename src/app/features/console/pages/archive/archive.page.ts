import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../shared/ui/button/button';
import { ConfirmService } from '../../../../shared/ui/confirm-dialog/confirm.service';
import { StatusPanel } from '../../../../shared/ui/status-panel/status-panel';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { PageHeader } from '../../components/page-header/page-header';
import { ConsoleStore } from '../../services/console-store';
import { AdminArchiveEntry } from '../../models/admin';
import { describeApiError } from '../../utils/api-error';
import { plural } from '../../utils/format';

/** Published-state list for the Treaties & Conciliation Archive entries. */
@Component({
  selector: 'app-console-archive',
  standalone: true,
  imports: [RouterLink, Button, PageHeader, StatusPanel, TableSkeleton],
  templateUrl: './archive.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchivePage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  readonly entries = this.store.archiveEntries;
  readonly plural = plural;
  readonly loading = this.store.archiveEntriesLoading;
  readonly loadError = signal<string | null>(null);
  readonly pendingId = signal<string | null>(null);

  ngOnInit(): void {
    this.seo.update({
      title: 'Treaties Archive',
      description: 'Manage the public Treaties & Conciliation Archive entries.',
      noIndex: true,
    });
    void this.reload();
  }

  async reload(): Promise<void> {
    this.loadError.set(null);
    try {
      await this.store.loadArchiveEntries();
    } catch (error) {
      this.loadError.set(describeApiError(error, 'Could not load the archive.'));
    }
  }

  async togglePublished(entry: AdminArchiveEntry): Promise<void> {
    if (this.pendingId()) return;
    if (entry.published) {
      const confirmed = await this.confirm.ask({
        title: `Unpublish ${entry.title}?`,
        message: 'It will be hidden from the public Treaties Archive until you publish it again.',
        confirmLabel: 'Unpublish',
      });
      if (!confirmed) return;
    }
    await this.run(
      entry,
      async () => {
        await this.store.setArchiveEntryPublished(entry.id, !entry.published);
        this.toast.success(entry.published ? 'Entry unpublished.' : 'Entry published.');
      },
      'Could not update the entry.',
    );
  }

  async remove(entry: AdminArchiveEntry): Promise<void> {
    if (this.pendingId()) return;
    const confirmed = await this.confirm.ask({
      title: `Delete ${entry.title}?`,
      message: `${entry.refCode} will be permanently removed from the archive. This cannot be undone — unpublish instead if you may need it again.`,
      confirmLabel: 'Delete entry',
      cancelLabel: 'Keep entry',
      tone: 'danger',
    });
    if (!confirmed) return;
    await this.run(
      entry,
      async () => {
        await this.store.deleteArchiveEntry(entry.id);
        this.toast.success('Entry deleted.');
      },
      'Could not delete the entry.',
    );
  }

  private async run(entry: AdminArchiveEntry, action: () => Promise<void>, failure: string) {
    this.pendingId.set(entry.id);
    try {
      await action();
    } catch (error) {
      this.toast.error(describeApiError(error, failure));
    } finally {
      this.pendingId.set(null);
    }
  }
}
