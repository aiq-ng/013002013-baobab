import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProgramStrategy } from './program-strategy';

describe('ProgramStrategy', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [ProgramStrategy], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProgramStrategy);
    fixture.componentRef.setInput('keyPoints', ['Pathways for surrender', 'Community acceptance']);
    fixture.componentRef.setInput('heading', 'Pathways for disengagement and reintegration.');
    fixture.componentRef.setInput('expectedImpact', 'Stronger trust between states.');
    fixture.componentRef.setInput('imageUrl', '/images/home/spokesperson-portrait.jpg');
    fixture.componentRef.setInput('imageAlt', 'Portrait of a senior official');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('lists the key points', () => {
    const el = render();
    expect(el.textContent).toContain('Key points');
    const items = Array.from(el.querySelectorAll('li')).map((li) => li.textContent?.trim());
    expect(items).toEqual(['Pathways for surrender', 'Community acceptance']);
  });

  it('renders the strategy heading under a "From our strategy" eyebrow, with the expected impact', () => {
    const el = render();
    expect(el.textContent).toContain('From our strategy');
    expect(el.querySelector('h2')?.textContent).toContain(
      'Pathways for disengagement and reintegration.',
    );
    expect(el.textContent).toContain('Expected impact: Stronger trust between states.');
  });

  it('links its single CTA to the About page and shows the portrait', () => {
    const el = render();
    const cta = el.querySelector('a[href="/about"]');
    expect(cta?.textContent).toContain('About Us');
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('Portrait of a senior official');
  });
});
