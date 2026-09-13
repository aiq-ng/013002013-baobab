import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { ArchiveEntry } from '../../models/resource';

const ALL = 'All Accords';

/**
 * "Treaties & Conciliation Archive": signal-driven filter pills (All Accords /
 * Transhumance / Riparian & Water) over a list of accord entries. Same
 * signals-over-a-list pattern as `shared/theater-map`, without the map grid.
 */
@Component({
  selector: 'app-treaties-archive',
  standalone: true,
  templateUrl: './treaties-archive.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatiesArchive {
  @Input() set entries(value: ArchiveEntry[]) {
    this._entries.set(value ?? []);
    this.activeFilter.set(ALL);
  }
  get entries(): ArchiveEntry[] {
    return this._entries();
  }

  private readonly _entries = signal<ArchiveEntry[]>([]);
  readonly activeFilter = signal<string>(ALL);

  readonly filterPills = computed(() => [
    ALL,
    ...Array.from(new Set(this._entries().map((e) => e.category))),
  ]);

  readonly filteredEntries = computed(() => {
    const filter = this.activeFilter();
    const all = this._entries();
    return filter === ALL ? all : all.filter((e) => e.category === filter);
  });

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}
