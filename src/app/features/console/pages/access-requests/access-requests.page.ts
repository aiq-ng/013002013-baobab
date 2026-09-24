import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DataTable, DataTableColumn } from '../../../../shared/ui/data-table/data-table';
import { StatusPanel } from '../../../../shared/ui/status-panel/status-panel';
import { DecisionPanel, Decision } from '../../components/decision-panel/decision-panel';
import { PageHeader } from '../../components/page-header/page-header';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ConsoleStore } from '../../services/console-store';
import { AdminAccessRequest } from '../../models/admin';
import { describeApiError } from '../../utils/api-error';
import { formatDate } from '../../utils/format';

@Component({
  selector: 'app-console-access-requests',
  standalone: true,
  imports: [DataTable, DecisionPanel, PageHeader, StatusPanel],
  templateUrl: './access-requests.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessRequestsPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly panel = viewChild(DecisionPanel);

  readonly selected = signal<AdminAccessRequest | null>(null);
  readonly deciding = signal<'approve' | 'deny' | null>(null);
  readonly loadError = signal<string | null>(null);
  readonly rows = this.store.accessRequests;
  readonly loading = this.store.accessRequestsLoading;

  readonly columns: DataTableColumn<AdminAccessRequest>[] = [
    { key: 'reference', header: 'Reference', cell: (r) => r.referenceId },
    { key: 'name', header: 'Name', cell: (r) => r.name },
    { key: 'email', header: 'Email', cell: (r) => r.email, hideOnMobile: true },
    {
      key: 'institution',
      header: 'Institution',
      cell: (r) => r.institution ?? '—',
      hideOnMobile: true,
    },
    { key: 'requested', header: 'Requested', cell: (r) => formatDate(r.createdAt) },
  ];
  readonly rowLabel = (r: AdminAccessRequest): string => `Review request ${r.referenceId}`;
  readonly rowKey = (r: AdminAccessRequest): string => r.id;

  ngOnInit(): void {
    this.seo.update({
      title: 'Access requests',
      description: 'Track 1.5 access request review queue.',
      noIndex: true,
    });
    void this.reload();
  }

  async reload(): Promise<void> {
    this.loadError.set(null);
    try {
      await this.store.loadAccessRequests();
    } catch (error) {
      this.loadError.set(describeApiError(error, 'Could not load the review queue.'));
    }
  }

  open(row: AdminAccessRequest): void {
    this.selected.set(row);
  }

  async onDecided(decision: Decision): Promise<void> {
    const row = this.selected();
    if (!row || this.deciding()) return;
    this.deciding.set(decision.approve ? 'approve' : 'deny');
    try {
      await this.store.decideAccessRequest(row.id, {
        approve: decision.approve,
        note: decision.note || undefined,
        expectedState: row.state,
      });
      this.toast.success(decision.approve ? 'Access approved.' : 'Access denied.');
      this.panel()?.reset();
      this.selected.set(null);
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse && error.status === 409) {
        this.toast.error('Someone else already decided this request.');
        this.selected.set(null);
        await this.reload();
      } else {
        this.toast.error(describeApiError(error, 'Could not record the decision.'));
      }
    } finally {
      this.deciding.set(null);
    }
  }
}
