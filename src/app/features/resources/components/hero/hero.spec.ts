import { TestBed } from '@angular/core/testing';
import { ResourcesHero } from './hero';

describe('ResourcesHero', () => {
  it('renders the eyebrow, headline, subtext, and the three static tag pills', () => {
    TestBed.configureTestingModule({ imports: [ResourcesHero] });
    const fixture = TestBed.createComponent(ResourcesHero);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Doctrine & Intellectual Repository');
    expect(text).toContain('Declassified Diplomatic Communiqués, Codices & Strategic Reviews');
    expect(text).toContain('Accredited Secretarial Standard');
    expect(text).toContain('Declassified Cycle: Q2 2025');
    expect(text).toContain('English');
    expect(text).toContain('Fulfulde');
  });
});
