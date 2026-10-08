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

  it('renders the eyebrow, headline, and intro copy without the old liaison column', () => {
    const fixture = TestBed.createComponent(ContactHero);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('CONTACT US');
    expect(text).toContain("We'd love to hear from you.");
    expect(text).toContain(
      'Tell us about your organization, your question or your idea for working together.',
    );
    expect(text).not.toContain("Let's talk!");
    expect(text).not.toContain('Head Office');
  });
});
