import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { BadgeTone, DataTable, DataTableColumn } from '../../../../shared/ui/data-table/data-table';
import { StatusPanel } from '../../../../shared/ui/status-panel/status-panel';
import { FilterBar, FilterOption } from '../../components/filter-bar/filter-bar';
import { DetailDrawer } from '../../components/detail-drawer/detail-drawer';
import { PageHeader } from '../../components/page-header/page-header';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ConsoleStore } from '../../services/console-store';
import { AdminEngagement, SubmissionStatus } from '../../models/admin';
import { describeApiError } from '../../utils/api-error';
import { formatDate, humanize, plural } from '../../utils/format';

const PAGE_SIZE = 25;

const STATUS_FILTERS: FilterOption[] = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'actioned', label: 'Actioned' },
  { value: 'spam', label: 'Spam' },
];

const STATUS_TONES: Record<SubmissionStatus, BadgeTone> = {
  new: 'info',
  read: 'neutral',
  actioned: 'success',
  spam: 'danger',
};

@Component({
  selector: 'app-console-submissions',
  standalone: true,
  imports: [DataTable, FilterBar, DetailDrawer, PageHeader, StatusPanel],
  templateUrl: './submissions.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionsPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly statusFilters = STATUS_FILTERS;
  readonly activeStatus = signal<string | null>(null);
  readonly page = signal(1);
  readonly selected = signal<AdminEngagement | null>(null);
  readonly updatingStatus = signal(false);
  readonly loadError = signal<string | null>(null);

  readonly rows = this.store.engagements;
  readonly plural = plural;
  readonly loading = this.store.engagementsLoading;
  readonly total = this.store.engagementsTotal;

  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));
  readonly rangeLabel = computed(() => {
    if (this.total() === 0) return '0 results';
    const start = (this.page() - 1) * PAGE_SIZE + 1;
    const end = Math.min(this.page() * PAGE_SIZE, this.total());
    return `${start}–${end} of ${this.total()}`;
  });

  readonly columns: DataTableColumn<AdminEngagement>[] = [
    { key: 'reference', header: 'Reference', cell: (r) => r.referenceId },
    { key: 'name', header: 'Name', cell: (r) => r.name },
    { key: 'email', header: 'Email', cell: (r) => r.email, hideOnMobile: true },
    { key: 'source', header: 'Source', cell: (r) => humanize(r.source), hideOnMobile: true },
    { key: 'status', header: 'Status', cell: (r) => r.status, tone: (r) => STATUS_TONES[r.status] },
    { key: 'submitted', header: 'Submitted', cell: (r) => formatDate(r.submittedAt) },
  ];
  readonly rowLabel = (r: AdminEngagement): string => `Open submission ${r.referenceId}`;
  readonly rowKey = (r: AdminEngagement): string => r.id;

  readonly query = computed(() => ({
    ...(this.activeStatus() ? { status: this.activeStatus() as string } : {}),
    page: this.page(),
    pageSize: PAGE_SIZE,
  }));

  ngOnInit(): void {
    this.seo.update({
      title: 'Submissions',
      description: 'Engagement submissions.',
      noIndex: true,
    });
    void this.reload();
  }

  async reload(): Promise<void> {
    this.loadError.set(null);
    try {
      await this.store.loadEngagements(this.query());
    } catch (error) {
      this.loadError.set(describeApiError(error, 'Could not load submissions.'));
    }
  }

  async onFilterSelected(status: string | null): Promise<void> {
    this.activeStatus.set(status);
    this.page.set(1);
    await this.reload();
  }

  async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.pageCount() || this.loading()) return;
    this.page.set(page);
    await this.reload();
  }

  open(row: AdminEngagement): void {
    this.selected.set(row);
  }

  async onStatusChanged(status: SubmissionStatus): Promise<void> {
    const row = this.selected();
    if (!row || this.updatingStatus()) return;
    this.updatingStatus.set(true);
    try {
      await this.store.setEngagementStatus(row.id, status, this.query());
      this.toast.success(`Marked as ${status}.`);
      this.selected.set(this.store.engagements().find((e) => e.id === row.id) ?? null);
    } catch (error) {
      this.toast.error(describeApiError(error, 'Could not update status.'));
    } finally {
      this.updatingStatus.set(false);
    }
  }
}
