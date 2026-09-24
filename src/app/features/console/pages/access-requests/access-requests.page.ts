import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DataTable, DataTableColumn } from '../../../../shared/ui/data-table/data-table';
import { DecisionPanel, Decision } from '../../components/decision-panel/decision-panel';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ConsoleStore } from '../../services/console-store';
import { AdminAccessRequest } from '../../models/admin';

@Component({
  selector: 'app-console-access-requests',
  standalone: true,
  imports: [DataTable, DecisionPanel],
  templateUrl: './access-requests.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessRequestsPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly selected = signal<AdminAccessRequest | null>(null);
  readonly rows = this.store.accessRequests;
  readonly loading = this.store.accessRequestsLoading;

  readonly columns: DataTableColumn<AdminAccessRequest>[] = [
    { key: 'reference', header: 'Reference', cell: (r) => r.referenceId },
    { key: 'email', header: 'Email', cell: (r) => r.email },
    { key: 'institution', header: 'Institution', cell: (r) => r.institution ?? '—' },
    { key: 'requested', header: 'Requested', cell: (r) => r.createdAt },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: 'Access requests',
      description: 'Track 1.5 access request review queue.',
      noIndex: true,
    });
    void this.reload();
  }

  private async reload(): Promise<void> {
    try {
      await this.store.loadAccessRequests();
    } catch {
      this.toast.error('Could not load the review queue.');
    }
  }

  open(row: AdminAccessRequest): void {
    this.selected.set(row);
  }

  async onDecided(decision: Decision): Promise<void> {
    const row = this.selected();
    if (!row) return;
    try {
      await this.store.decideAccessRequest(row.id, {
        approve: decision.approve,
        note: decision.note || undefined,
        expectedState: row.state,
      });
      this.toast.success(decision.approve ? 'Access approved.' : 'Access denied.');
      this.selected.set(null);
    } catch (error: unknown) {
      const status = (error as { status?: number } | null)?.status;
      if (status === 409) {
        this.toast.error('Someone else already decided this request.');
        await this.reload();
      } else {
        this.toast.error('Could not record the decision.');
      }
    }
  }
}
