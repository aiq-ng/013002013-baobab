import { TestBed } from '@angular/core/testing';
import { CoreValues } from './core-values';

describe('CoreValues', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CoreValues] });
  });

  it('renders the eyebrow and heading', () => {
    const fixture = TestBed.createComponent(CoreValues);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('OUR CORE VALUES');
    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe('Our values');
  });

  it('renders the five values, with the "Flexible" typo from the export corrected', () => {
    const fixture = TestBed.createComponent(CoreValues);
    fixture.detectChanges();
    const items = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('li')).map(
      (li) => li.textContent?.trim(),
    );
    expect(items).toEqual([
      'African-led, driven by local realities and solutions.',
      'Trusted by communities, respected by governments.',
      'Bridges ECOWAS and AES divides.',
      'Combines traditional wisdom, religious legitimacy and modern expertise.',
      'Flexible, confidential and results-oriented.',
    ]);
  });

  it('marks value icons as decorative', () => {
    const fixture = TestBed.createComponent(CoreValues);
    fixture.detectChanges();
    const icons: SVGElement[] = Array.from(fixture.nativeElement.querySelectorAll('svg'));
    expect(icons.length).toBe(5);
    icons.forEach((icon) => expect(icon.getAttribute('aria-hidden')).toBe('true'));
  });
});
