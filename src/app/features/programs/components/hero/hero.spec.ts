import { TestBed } from '@angular/core/testing';
import { ProgramsHero } from './hero';

describe('ProgramsHero', () => {
  it('renders the eyebrow, headline, and subtext', () => {
    TestBed.configureTestingModule({ imports: [ProgramsHero] });
    const fixture = TestBed.createComponent(ProgramsHero);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Programs and Services');
    expect(el.querySelector('h1')?.textContent).toContain(
      'We support dialogue, mediation, community resilience, research, reintegration and policy across West Africa.',
    );
    expect(el.textContent).toContain('Through track 1.5 diplomacy');
  });
});
