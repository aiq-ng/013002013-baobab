import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ContactFaq } from './faq';

describe('ContactFaq', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactFaq],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(ContactFaq);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the section heading, the Key Mandates card, and all 5 questions', () => {
    const fixture = TestBed.createComponent(ContactFaq);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Frequently Asked Questions');
    expect(text).toContain('Diplomatic Repository');
    expect(text).toContain('5 Clarifications');
    expect(text).toContain('Key Mandates & Sovereign Protocols');
    expect(fixture.componentInstance.faqs.length).toBe(5);
    expect(text).toContain('1. How can my government or institution initiate a dialogue?');
    expect(text).toContain('Reach the Office of the Permanent Secretariat');
    expect(text).toContain('5. Access to statecraft archives & customary treaties?');
  });

  it('links "View All 5 FAQs" to the FAQ detail route, not a dead click', () => {
    const fixture = TestBed.createComponent(ContactFaq);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.nativeElement.getAttribute('href')).toBe('/contact/faq');
    }
  });
});
