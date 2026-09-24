import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(data: SeoData): void {
    const fullTitle = `${data.title} | The Baobab Group`;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Optional tags are removed when absent: Meta persists across client-side
    // navigations, so a previous page's noindex or image would otherwise stick.
    if (data.image) {
      this.meta.updateTag({ property: 'og:image', content: data.image });
    } else {
      this.meta.removeTag('property="og:image"');
    }
    if (data.url) {
      this.meta.updateTag({ property: 'og:url', content: data.url });
    } else {
      this.meta.removeTag('property="og:url"');
    }
    if (data.noIndex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.removeTag('name="robots"');
    }
  }
}
