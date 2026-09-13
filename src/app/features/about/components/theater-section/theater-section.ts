import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TheaterMap, TheaterEntry } from '../../../../shared/theater-map/theater-map';

// Filter pill categories only — the card grid is replaced by an empty state until
// real-time theater data is available, so description/imageUrl/route go unused.
const THEATERS: TheaterEntry[] = [
  {
    name: 'Dakar Secretariat',
    theater: 'Continental ECOWAS',
    description: '',
    imageUrl: '',
    route: '',
  },
  {
    name: 'Liptako-Gourma Theater',
    theater: 'Sahel Central',
    description: '',
    imageUrl: '',
    route: '',
  },
  {
    name: 'Lake Chad Basin',
    theater: 'Lake Chad Basin',
    description: '',
    imageUrl: '',
    route: '',
  },
  {
    name: 'Northern Littoral Flank',
    theater: 'Gulf of Guinea',
    description: '',
    imageUrl: '',
    route: '',
  },
];

/** Interactive theater map section — filter pills driving the theater grid. */
@Component({
  selector: 'app-theater-section',
  standalone: true,
  imports: [TheaterMap],
  templateUrl: './theater-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheaterSection {
  readonly theaters = THEATERS;
}
