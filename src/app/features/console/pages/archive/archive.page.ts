import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../shared/ui/button/button';
import { ConsoleStore } from '../../services/console-store';
import { AdminArchiveEntry } from '../../models/admin';

/** Published-state list for the Treaties & Conciliation Archive entries. */
@Component({
  selector: 'app-console-archive',
  standalone: true,
  imports: [RouterLink, Button],
  templateUrl: './archive.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchivePage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly entries = this.store.archiveEntries;
  readonly loading = this.store.archiveEntriesLoading;

  ngOnInit(): void {
    this.seo.update({
      title: 'Treaties Archive',
      description: 'Manage the public Treaties & Conciliation Archive entries.',
      noIndex: true,
    });
    void this.store.loadArchiveEntries();
  }

  async togglePublished(entry: AdminArchiveEntry): Promise<void> {
    try {
      await this.store.setArchiveEntryPublished(entry.id, !entry.published);
      this.toast.success(entry.published ? 'Entry unpublished.' : 'Entry published.');
    } catch {
      this.toast.error('Could not update the entry.');
    }
  }

  async remove(entry: AdminArchiveEntry): Promise<void> {
    try {
      await this.store.deleteArchiveEntry(entry.id);
      this.toast.success('Entry deleted.');
    } catch {
      this.toast.error('Could not delete the entry.');
    }
  }
}
