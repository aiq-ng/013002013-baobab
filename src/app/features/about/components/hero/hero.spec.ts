import { TestBed } from '@angular/core/testing';
import { AboutHero } from './hero';

describe('AboutHero', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AboutHero] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(AboutHero);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the eyebrow, headline, and intro copy', () => {
    const fixture = TestBed.createComponent(AboutHero);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('KNOW ABOUT US');
    expect(text).toContain('Track 1.5 sovereign advisory');
    expect(text).toContain('ancestral premise of the West African palaver tree');
  });
});
