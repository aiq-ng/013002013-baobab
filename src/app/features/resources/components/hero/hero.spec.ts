import { TestBed } from '@angular/core/testing';
import { ResourcesHero } from './hero';

describe('ResourcesHero', () => {
  it('renders the eyebrow, headline, and subtext from the design export', () => {
    TestBed.configureTestingModule({ imports: [ResourcesHero] });
    const fixture = TestBed.createComponent(ResourcesHero);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Resources');
    expect(el.querySelector('h1')!.textContent).toContain('Strategy and publications');
    expect(el.textContent).toContain('Read and download our strategy document and publications.');
  });

  it('no longer renders the old tag pills', () => {
    TestBed.configureTestingModule({ imports: [ResourcesHero] });
    const fixture = TestBed.createComponent(ResourcesHero);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ul')).toBeNull();
  });
});
