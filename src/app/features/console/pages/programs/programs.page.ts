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
import { AdminProgram } from '../../models/admin';
import { describeApiError } from '../../utils/api-error';
import { plural } from '../../utils/format';

/**
 * Program registry (PROGRAMS MAIN.png): every program on the public site,
 * with create, edit and delete. Deleting removes the program's public page,
 * so it goes through a danger confirmation naming the program and its URL.
 */
@Component({
  selector: 'app-console-programs',
  standalone: true,
  imports: [RouterLink, Button, PageHeader, StatusPanel, TableSkeleton],
  templateUrl: './programs.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  readonly programs = this.store.programs;
  readonly loading = this.store.programsLoading;
  readonly plural = plural;
  readonly loadError = signal<string | null>(null);
  /** Slug of the program being deleted — its row's actions lock meanwhile. */
  readonly deleting = signal<string | null>(null);

  ngOnInit(): void {
    this.seo.update({
      title: 'Programs',
      description: 'Secretariat repositories — strategic portfolios.',
      noIndex: true,
    });
    void this.reload();
  }

  async reload(): Promise<void> {
    this.loadError.set(null);
    try {
      await this.store.loadPrograms();
    } catch (error) {
      this.loadError.set(describeApiError(error, 'Could not load programs.'));
    }
  }

  number(program: AdminProgram): string {
    return program.sortOrder.toString().padStart(2, '0');
  }

  async askDelete(program: AdminProgram): Promise<void> {
    if (this.deleting()) return;
    const confirmed = await this.confirm.ask({
      title: `Delete ${program.title}?`,
      message: `Its public page at /programs/${program.slug} will stop working immediately. This cannot be undone.`,
      confirmLabel: 'Delete program',
      cancelLabel: 'Keep program',
      tone: 'danger',
    });
    if (!confirmed) return;

    this.deleting.set(program.slug);
    try {
      await this.store.deleteProgram(program.slug);
      this.toast.success(`${program.title} deleted.`);
    } catch (error) {
      this.toast.error(describeApiError(error, 'Could not delete the program.'));
    } finally {
      this.deleting.set(null);
    }
  }
}
