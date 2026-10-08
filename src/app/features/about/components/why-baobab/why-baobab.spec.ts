import { TestBed } from '@angular/core/testing';
import { WhyBaobab } from './why-baobab';

describe('WhyBaobab', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [WhyBaobab] });
  });

  it('renders the eyebrow, heading, and copy', () => {
    const fixture = TestBed.createComponent(WhyBaobab);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('WHO WE ARE');
    expect(el.querySelector('h2')?.textContent?.trim()).toBe('Why Baobab?');
    expect(el.textContent).toContain('The Baobab is the ancient African "Tree of Life."');
    expect(el.textContent).toContain(
      'We bridge the gap between high-level statecraft and grassroots reality.',
    );
  });

  it('renders the baobab photo with alt text', () => {
    const fixture = TestBed.createComponent(WhyBaobab);
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toContain('/images/about/why-baobab-trees.jpg');
    expect(img.getAttribute('alt')).toBeTruthy();
  });
});
