import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WhereWeWork } from './where-we-work';

describe('WhereWeWork', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [WhereWeWork], providers: [provideRouter([])] });
  });

  function render() {
    const fixture = TestBed.createComponent(WhereWeWork);
    fixture.detectChanges();
    return fixture;
  }

  function pills(el: HTMLElement): HTMLButtonElement[] {
    return Array.from(el.querySelectorAll('[role="group"] button'));
  }

  it('renders the four region pills with "Where we work" selected', () => {
    const fixture = render();
    const buttons = pills(fixture.nativeElement);
    expect(buttons.map((b) => b.textContent?.trim())).toEqual([
      'Where we work',
      'ECOWAS member states',
      'Alliance of Sahel States (AES)',
      'Other states',
    ]);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('shows the overview heading and copy by default', () => {
    const fixture = render();
    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe(
      'We work across ECOWAS and AES countries.',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'Military responses are necessary but not sufficient.',
    );
  });

  it('swaps the banner copy when a region pill is selected', () => {
    const fixture = render();
    pills(fixture.nativeElement)[2].click();
    fixture.detectChanges();
    expect(pills(fixture.nativeElement)[2].getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Burkina Faso');
    expect(fixture.nativeElement.textContent).toContain('Mali');
    expect(fixture.nativeElement.textContent).toContain('Niger');
  });

  it('routes the primary CTA to Partnerships and the secondary to Contact', () => {
    const fixture = render();
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    const hrefs = links.map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/partnerships');
    expect(hrefs).toContain('/contact');
  });
});
