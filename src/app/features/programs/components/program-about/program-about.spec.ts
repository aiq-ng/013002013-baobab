import { TestBed } from '@angular/core/testing';
import { ProgramAbout } from './program-about';

describe('ProgramAbout', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [ProgramAbout] });
    const fixture = TestBed.createComponent(ProgramAbout);
    fixture.componentRef.setInput('title', 'Hybrid Mediation & Reconciliation');
    fixture.componentRef.setInput('badgeText', 'ALL REGIONS');
    fixture.componentRef.setInput('imageUrl', '/images/partnerships/plenary-assembly.jpg');
    fixture.componentRef.setInput('imageAlt', 'Mediators in conversation');
    fixture.componentRef.setInput('paragraphs', ['First paragraph.', 'Second paragraph.']);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the program photo with its badge and title', () => {
    const el = render();
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('Mediators in conversation');
    expect(el.textContent).toContain('ALL REGIONS');
    expect(el.textContent).toContain('Hybrid Mediation & Reconciliation');
  });

  it('renders the "About this program:" heading, the title eyebrow, and one <p> per paragraph', () => {
    const el = render();
    expect(el.querySelector('h2')?.textContent).toContain('About this program:');
    const paragraphs = Array.from(el.querySelectorAll('[data-testid="about-paragraph"]'));
    expect(paragraphs.map((p) => p.textContent?.trim())).toEqual([
      'First paragraph.',
      'Second paragraph.',
    ]);
  });
});
