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
    expect(text).toContain('Short answers about who we are and how we work.');
    expect(text).toContain('Key Mandates & Sovereign Protocols');
    expect(text).not.toContain('Diplomatic Repository');
    expect(fixture.componentInstance.faqs.length).toBe(5);
    expect(text).toContain('1. Who do you work with?');
    expect(text).toContain('2. Where do you work?');
    expect(text).toContain('3. Do you replace state security efforts?');
    expect(text).toContain('4. Is engagement confidential?');
    expect(text).toContain('5. How do I read your publications?');
    expect(text).toContain('Across ECOWAS and AES countries in West Africa.');
  });

  it('routes "How do I read your publications?" readers to the Resources page', () => {
    const fixture = TestBed.createComponent(ContactFaq);
    fixture.detectChanges();
    const link = fixture.debugElement
      .queryAll(By.css('a'))
      .find((a) => a.nativeElement.textContent.includes('Resources'));
    expect(link?.nativeElement.getAttribute('href')).toBe('/resources');
  });

  it('points the "Ready to start a conversation?" CTA at the contact form, not a dead click', () => {
    const fixture = TestBed.createComponent(ContactFaq);
    fixture.detectChanges();
    const cta = fixture.debugElement
      .queryAll(By.css('a'))
      .find((a) => a.nativeElement.textContent.includes('Ready to start a conversation?'));
    expect(cta?.nativeElement.getAttribute('href')).toBe('/contact#contact-form');
  });
});
