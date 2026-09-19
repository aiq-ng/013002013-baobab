import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DataTable, DataTableColumn } from '../../../../shared/ui/data-table/data-table';
import { FilterBar, FilterOption } from '../../components/filter-bar/filter-bar';
import { DetailDrawer } from '../../components/detail-drawer/detail-drawer';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ConsoleStore } from '../../services/console-store';
import { AdminEngagement, SubmissionStatus } from '../../models/admin';

const STATUS_FILTERS: FilterOption[] = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'actioned', label: 'Actioned' },
  { value: 'spam', label: 'Spam' },
];

@Component({
  selector: 'app-console-submissions',
  standalone: true,
  imports: [DataTable, FilterBar, DetailDrawer],
  templateUrl: './submissions.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionsPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly statusFilters = STATUS_FILTERS;
  readonly activeStatus = signal<string | null>(null);
  readonly selected = signal<AdminEngagement | null>(null);

  readonly rows = this.store.engagements;
  readonly loading = this.store.engagementsLoading;
  readonly total = this.store.engagementsTotal;

  readonly columns: DataTableColumn<AdminEngagement>[] = [
    { key: 'reference', header: 'Reference', cell: (r) => r.referenceId },
    { key: 'source', header: 'Source', cell: (r) => r.source },
    { key: 'name', header: 'Name', cell: (r) => r.name },
    { key: 'email', header: 'Email', cell: (r) => r.email },
    { key: 'status', header: 'Status', cell: (r) => r.status },
    { key: 'submitted', header: 'Submitted', cell: (r) => r.submittedAt },
  ];

  readonly query = computed(() => ({ status: this.activeStatus() ?? undefined }));

  ngOnInit(): void {
    this.seo.update({
      title: 'Submissions',
      description: 'Engagement submissions.',
      noIndex: true,
    });
    void this.reload();
  }

  private async reload(): Promise<void> {
    try {
      await this.store.loadEngagements(this.query());
    } catch {
      this.toast.error('Could not load submissions.');
    }
  }

  async onFilterSelected(status: string | null): Promise<void> {
    this.activeStatus.set(status);
    await this.reload();
  }

  open(row: AdminEngagement): void {
    this.selected.set(row);
  }

  async onStatusChanged(status: SubmissionStatus): Promise<void> {
    const row = this.selected();
    if (!row) return;
    try {
      await this.store.setEngagementStatus(row.id, status, this.query());
      this.toast.success('Status updated.');
      this.selected.set(this.store.engagements().find((e) => e.id === row.id) ?? null);
    } catch {
      this.toast.error('Could not update status.');
    }
  }
}
