import { TestBed } from '@angular/core/testing';
import { ProgramsHero } from './hero';

describe('ProgramsHero', () => {
  it('renders the headline and all 4 stats', () => {
    TestBed.configureTestingModule({ imports: [ProgramsHero] });
    const fixture = TestBed.createComponent(ProgramsHero);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain("We're building an enduring peace");
    expect(text).toContain('14,280 KM');
    expect(text).toContain('SECURED TRANSIT CORRIDORS');
    expect(text).toContain('SOVEREIGN MANDATES');
  });
});
