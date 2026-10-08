import { TestBed } from '@angular/core/testing';
import { ApproachGrid } from './approach-grid';

describe('ApproachGrid', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ApproachGrid] });
  });

  it('renders the section heading', () => {
    const fixture = TestBed.createComponent(ApproachGrid);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe(
      'Our distinctive approach',
    );
  });

  it('renders the six approach cards from the design export, in order', () => {
    const fixture = TestBed.createComponent(ApproachGrid);
    fixture.detectChanges();
    const titles = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('li h3')).map(
      (h) => h.textContent?.trim(),
    );
    expect(titles).toEqual([
      'State Primacy',
      'Community Ownership',
      'Differentiated Engagement',
      'Hybrid Mediation',
      'Incremental Peacebuilding',
      'Regional Harmonization',
    ]);
    expect(fixture.nativeElement.textContent).toContain(
      'We support, not replace, state authority.',
    );
  });

  it('gives every card image alt text', () => {
    const fixture = TestBed.createComponent(ApproachGrid);
    fixture.detectChanges();
    const imgs: HTMLImageElement[] = Array.from(fixture.nativeElement.querySelectorAll('img'));
    expect(imgs.length).toBe(6);
    imgs.forEach((img) => expect(img.getAttribute('alt')).toBeTruthy());
  });

  it('keeps every card the same height (equal grid rows, cards stretched to fill them)', () => {
    const fixture = TestBed.createComponent(ApproachGrid);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('ul')?.classList).toContain('auto-rows-fr');
    const articles: HTMLElement[] = Array.from(el.querySelectorAll('app-card article'));
    expect(articles.length).toBe(6);
    articles.forEach((a) => expect(a.classList).toContain('h-full'));
  });
});
