import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';
import { Card } from '../../../../shared/ui/card/card';

interface TheaterPreview {
  slug: string;
  badgeText: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
}

/** "Our Operational Theaters" — 3 operational theater preview cards. */
@Component({
  selector: 'app-theater-previews',
  standalone: true,
  imports: [Eyebrow, Card, RouterLink],
  templateUrl: './theater-previews.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheaterPreviews {
  readonly theaters: TheaterPreview[] = [
    {
      slug: 'liptako-gourma',
      badgeText: 'SAHEL CENTRAL',
      imageUrl: '/images/home/theater-sahel-central.jpg',
      imageAlt: 'A dust storm over the Sahel at dusk',
      title: 'Liptako-Gourma Peace Corridor',
      description:
        'Establishment of bi-annual customary transit protocols across Mali, Niger, and Burkina Faso, reducing armed encounters by 64% across 8 priority…',
    },
    {
      slug: 'lake-chad-basin',
      badgeText: 'LAKE CHAD BASIN',
      imageUrl: '/images/home/theater-lake-chad.jpg',
      imageAlt: 'A community gathering beside the wetlands of Lake Chad',
      title: 'Customary Demobilization',
      description:
        'Empowering sultanate and village truth-telling assemblies, enabling over 3,400 former youth fighters to return peacefully to communal agrarian…',
    },
    {
      slug: 'gulf-of-guinea',
      badgeText: 'LITTORAL BUFFER',
      imageUrl: '/images/home/theater-littoral-buffer.jpg',
      imageAlt: 'A misty river winding through coastal forest',
      title: 'Gulf of Guinea Northern Flank',
      description:
        'Pre-emptive dialogue alliances across northern Ghana, Togo, Benin, and Côte d’Ivoire to inoculate frontier trade communities from regional extremist…',
    },
  ];
}
