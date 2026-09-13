import { TestBed } from '@angular/core/testing';
import { ContactHero } from './hero';

describe('ContactHero', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ContactHero] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(ContactHero);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the headline, eyebrow, and direct contact details', () => {
    const fixture = TestBed.createComponent(ContactHero);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('CONTACT US');
    expect(text).toContain("We'd love to hear from your delegation");
    expect(text).toContain('+221 33 820 00 44');
    expect(text).toContain('liaison@baobab-statecraft.org');
    expect(text).toContain('Villa 14, Almadies Diplomatic Enclave');
  });
});
