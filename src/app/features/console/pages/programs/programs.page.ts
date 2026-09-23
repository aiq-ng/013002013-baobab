import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';
import { ConsoleStore } from '../../services/console-store';

/**
 * Fixed-set registry of 6 programs (content-only editing — see
 * PROGRAMS MAIN.png). No add/delete/reorder controls exist by design.
 */
@Component({
  selector: 'app-console-programs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './programs.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);

  readonly programs = this.store.programs;
  readonly loading = this.store.programsLoading;

  ngOnInit(): void {
    this.seo.update({
      title: 'Programs',
      description: 'Secretariat repositories — mandatory strategic portfolios.',
      noIndex: true,
    });
    void this.store.loadPrograms();
  }

  truncate(text: string, max = 140): string {
    return text.length > max ? `${text.slice(0, max).trimEnd()}\u2026` : text;
  }
}
