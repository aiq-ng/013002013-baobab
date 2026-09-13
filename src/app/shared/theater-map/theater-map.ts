import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../ui/card/card';

export interface TheaterEntry {
  name: string;
  theater: string;
  description: string;
  imageUrl: string;
  route: string;
}

const ALL = 'All';

/**
 * Data-driven filterable "theater map": filter pills (by theater name) drive a
 * grid of theater preview cards. No third-party map library — the grid itself
 * represents the markers.
 */
@Component({
  selector: 'app-theater-map',
  standalone: true,
  imports: [Card, RouterLink],
  templateUrl: './theater-map.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheaterMap {
  @Input() set theaters(value: TheaterEntry[]) {
    this._theaters.set(value ?? []);
    this.activeFilter.set(ALL);
  }
  get theaters(): TheaterEntry[] {
    return this._theaters();
  }

  private readonly _theaters = signal<TheaterEntry[]>([]);
  readonly activeFilter = signal<string>(ALL);

  readonly filterPills = computed(() => [
    ALL,
    ...Array.from(new Set(this._theaters().map((t) => t.theater))),
  ]);

  readonly filteredTheaters = computed(() => {
    const filter = this.activeFilter();
    const all = this._theaters();
    return filter === ALL ? all : all.filter((t) => t.theater === filter);
  });

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}
