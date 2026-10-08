import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProgramsPreview } from './programs-preview';

describe('ProgramsPreview', () => {
  let fixture: ComponentFixture<ProgramsPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramsPreview],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ProgramsPreview);
    fixture.detectChanges();
  });

  it('renders the section heading and intro copy', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('THEMATIC ACTION');
    expect(el.textContent).toContain('Programs preview');
    expect(el.textContent).toContain(
      'Six areas of work, shaped around communities, governments and regional bodies.',
    );
  });

  it('renders the 3 program cards from the design export', () => {
    const titles: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('article h3'));
    expect(titles.map((h) => h.textContent!.trim())).toEqual([
      'Sovereign Dialogue Facilitation',
      'Hybrid Mediation & Reconciliation',
      'Community Resilience & Socio-Economic Programs',
    ]);
  });

  it('gives every card a routed "View Program" CTA, never a dead link', () => {
    const ctas: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('article a'),
    );
    expect(ctas.length).toBe(3);
    ctas.forEach((a) => {
      expect(a.textContent).toContain('View Program');
      expect(a.getAttribute('href')).toBe('/programs');
    });
  });

  it('renders a "View All Programs" CTA routed to the programs page', () => {
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    const all = links.find((a) => a.textContent!.includes('View All Programs'));
    expect(all!.getAttribute('href')).toBe('/programs');
  });
});
