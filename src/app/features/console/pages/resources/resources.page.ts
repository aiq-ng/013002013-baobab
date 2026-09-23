import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../shared/ui/button/button';
import { ConsoleStore } from '../../services/console-store';
import { AdminResource } from '../../models/admin';

/** Published-state toggle table for uploaded PDF resources (RESOURCES.png). */
@Component({
  selector: 'app-console-resources',
  standalone: true,
  imports: [RouterLink, Button],
  templateUrl: './resources.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  readonly resources = this.store.resources;
  readonly loading = this.store.resourcesLoading;

  ngOnInit(): void {
    this.seo.update({
      title: 'Resources',
      description: 'Published document archive for the public Resources page.',
      noIndex: true,
    });
    void this.store.loadResources();
  }

  formatSize(bytes: number): string {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }

  async togglePublished(resource: AdminResource): Promise<void> {
    const nextPublished = resource.downloadUrl === null;
    try {
      await this.store.setResourcePublished(resource.id, nextPublished);
      this.toast.success(nextPublished ? 'Resource published.' : 'Resource unpublished.');
    } catch {
      this.toast.error('Could not update the resource.');
    }
  }
}
