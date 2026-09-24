import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ResourcesHero } from './components/hero/hero';
import { ResourceHighlight } from './components/resource-highlight/resource-highlight';
import { TreatiesArchive } from './components/treaties-archive/treaties-archive';
import { SanctuaryDoctrine } from './components/sanctuary-doctrine/sanctuary-doctrine';
import { DataProtections } from './components/data-protections/data-protections';
import { SeoService } from '../../core/services/seo.service';
import { ArchiveApi } from './services/archive.api';
import { ArchiveEntry } from './models/resource';
import { PROTECTION_ITEMS } from './data/resources.data';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-resources-page',
  standalone: true,
  imports: [
    ResourcesHero,
    ResourceHighlight,
    TreatiesArchive,
    SanctuaryDoctrine,
    DataProtections,
    ScrollRevealDirective,
  ],
  templateUrl: './resources.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesPage implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly archiveApi = inject(ArchiveApi);

  readonly protectionItems = PROTECTION_ITEMS;

  private readonly _archiveEntries = signal<ArchiveEntry[]>([]);
  readonly archiveEntries = this._archiveEntries.asReadonly();

  ngOnInit(): void {
    this.seo.update({
      title: 'Resources',
      description:
        'Declassified diplomatic communiqués, codices, and strategic reviews from The Baobab Group — the Annual Statecraft Review, the Treaties & Conciliation Archive, and the Track 1.5 classified access gate.',
    });
    void this.loadArchiveEntries();
  }

  private async loadArchiveEntries(): Promise<void> {
    try {
      this._archiveEntries.set(await firstValueFrom(this.archiveApi.list()));
    } catch {
      // Leave the archive section empty rather than breaking the page.
    }
  }
}
