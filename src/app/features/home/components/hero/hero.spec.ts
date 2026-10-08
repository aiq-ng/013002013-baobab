import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Hero } from './hero';

describe('Hero', () => {
  let fixture: ComponentFixture<Hero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
  });

  it('renders the headline copy exactly as specified in the design export', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain('Peace. Dialogue. Resilience.');
    expect(heading.textContent).toContain('For A Stronger West Africa.');
  });

  it('renders the institutional subtext', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'The Baobab Group is a pan-West African peacebuilding and mediation institution dedicated to strengthening peace and stability through non-kinetic approaches.',
    );
  });

  it('renders a primary "Our Programs" CTA and a secondary "Contact Us" CTA, both routed', () => {
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    const programs = links.find((a) => a.textContent!.includes('Our Programs'));
    const contact = links.find((a) => a.textContent!.includes('Contact Us'));
    expect(programs!.getAttribute('href')).toBe('/programs');
    expect(contact!.getAttribute('href')).toBe('/contact');
  });

  it('no longer renders the hero stat counters', () => {
    expect(fixture.nativeElement.querySelector('app-stat-card')).toBeNull();
  });
});
