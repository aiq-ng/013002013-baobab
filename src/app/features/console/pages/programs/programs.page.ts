import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../shared/ui/button/button';
import { Modal } from '../../../../shared/ui/modal/modal';
import { ConsoleStore } from '../../services/console-store';
import { AdminProgram } from '../../models/admin';

/**
 * Program registry (PROGRAMS MAIN.png): every program on the public site,
 * with create, edit and delete. Deleting removes the program's public page,
 * so it goes through a confirmation dialog naming the program.
 */
@Component({
  selector: 'app-console-programs',
  standalone: true,
  imports: [RouterLink, Button, Modal],
  templateUrl: './programs.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly programs = this.store.programs;
  readonly loading = this.store.programsLoading;

  readonly pendingDelete = signal<AdminProgram | null>(null);
  readonly deleting = signal(false);

  ngOnInit(): void {
    this.seo.update({
      title: 'Programs',
      description: 'Secretariat repositories — strategic portfolios.',
      noIndex: true,
    });
    void this.store.loadPrograms();
  }

  truncate(text: string, max = 140): string {
    return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
  }

  askDelete(program: AdminProgram): void {
    this.pendingDelete.set(program);
  }

  cancelDelete(): void {
    if (!this.deleting()) {
      this.pendingDelete.set(null);
    }
  }

  async confirmDelete(): Promise<void> {
    const program = this.pendingDelete();
    if (!program) {
      return;
    }
    this.deleting.set(true);
    try {
      await this.store.deleteProgram(program.slug);
      this.toast.success(`${program.title} deleted.`);
      this.pendingDelete.set(null);
    } catch {
      this.toast.error('Could not delete the program.');
    } finally {
      this.deleting.set(false);
    }
  }
}
