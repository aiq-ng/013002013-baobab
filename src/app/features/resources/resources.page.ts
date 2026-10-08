import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ResourcesHero } from './components/hero/hero';
import { PublicationCard } from './components/publication-card/publication-card';
import { PublicationsList } from './components/publications-list/publications-list';
import { DispatchForm } from '../../shared/ui/dispatch-form/dispatch-form';
import { StatusPanel } from '../../shared/ui/status-panel/status-panel';
import { SeoService } from '../../core/services/seo.service';
import { ResourcesApi } from './services/resources.api';
import { RegistryDocument } from './models/resource';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

type LoadStatus = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-resources-page',
  standalone: true,
  imports: [
    ResourcesHero,
    PublicationCard,
    PublicationsList,
    DispatchForm,
    StatusPanel,
    ScrollRevealDirective,
  ],
  templateUrl: './resources.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesPage implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly resourcesApi = inject(ResourcesApi);

  private readonly documents = signal<RegistryDocument[]>([]);
  readonly status = signal<LoadStatus>('loading');

  /** The API returns newest first: the newest is featured, the rest are listed. */
  readonly featured = computed(() => this.documents()[0] ?? null);
  readonly others = computed(() => this.documents().slice(1));

  ngOnInit(): void {
    this.seo.update({
      title: 'Resources',
      description:
        "Read and download The Baobab Group's strategy document and publications on dialogue, mediation, and community resilience across West Africa.",
    });
    void this.load();
  }

  async load(): Promise<void> {
    this.status.set('loading');
    try {
      this.documents.set(await firstValueFrom(this.resourcesApi.list()));
      this.status.set('ready');
    } catch {
      this.status.set('error');
    }
  }
}
