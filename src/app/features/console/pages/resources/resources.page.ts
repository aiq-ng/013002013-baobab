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
import { AdminResource } from '../../models/admin';
import { describeApiError } from '../../utils/api-error';
import { formatDate, formatFileSize, plural } from '../../utils/format';

/** Published-state toggle table for uploaded PDF resources (RESOURCES.png). */
@Component({
  selector: 'app-console-resources',
  standalone: true,
  imports: [RouterLink, Button, PageHeader, StatusPanel, TableSkeleton],
  templateUrl: './resources.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  readonly resources = this.store.resources;
  readonly plural = plural;
  readonly loading = this.store.resourcesLoading;
  readonly loadError = signal<string | null>(null);
  readonly pendingId = signal<string | null>(null);

  readonly formatSize = formatFileSize;
  readonly formatDate = formatDate;

  ngOnInit(): void {
    this.seo.update({
      title: 'Resources',
      description: 'Published document archive for the public Resources page.',
      noIndex: true,
    });
    void this.reload();
  }

  async reload(): Promise<void> {
    this.loadError.set(null);
    try {
      await this.store.loadResources();
    } catch (error) {
      this.loadError.set(describeApiError(error, 'Could not load resources.'));
    }
  }

  isPublished(resource: AdminResource): boolean {
    return resource.downloadUrl !== null;
  }

  async togglePublished(resource: AdminResource): Promise<void> {
    if (this.pendingId()) return;
    const nextPublished = !this.isPublished(resource);
    if (!nextPublished) {
      const confirmed = await this.confirm.ask({
        title: `Unpublish ${resource.title}?`,
        message:
          'It will disappear from the public Resources page and its download link will stop working until you publish it again.',
        confirmLabel: 'Unpublish',
      });
      if (!confirmed) return;
    }
    this.pendingId.set(resource.id);
    try {
      await this.store.setResourcePublished(resource.id, nextPublished);
      this.toast.success(nextPublished ? 'Resource published.' : 'Resource unpublished.');
    } catch (error) {
      this.toast.error(describeApiError(error, 'Could not update the resource.'));
    } finally {
      this.pendingId.set(null);
    }
  }
}
