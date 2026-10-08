import { TestBed } from '@angular/core/testing';
import { StrategicPillars } from './strategic-pillars';

describe('StrategicPillars', () => {
  it('renders the "Four principles" heading and all 4 principles', () => {
    TestBed.configureTestingModule({ imports: [StrategicPillars] });
    const fixture = TestBed.createComponent(StrategicPillars);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2')?.textContent).toContain('Four principles');
    expect(el.textContent).toContain('Four principles guide how we work');
    expect(el.querySelectorAll('h3').length).toBe(4);
    expect(el.textContent).toContain('State primacy');
    expect(el.textContent).toContain('We support, not replace, state authority.');
    expect(el.textContent).toContain('Community ownership');
    expect(el.textContent).toContain('Hybrid mediation');
    expect(el.textContent).toContain('Regional harmonization');
  });

  it('labels all four cards as principles', () => {
    TestBed.configureTestingModule({ imports: [StrategicPillars] });
    const fixture = TestBed.createComponent(StrategicPillars);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('PRINCIPLE 04');
    expect(text).not.toContain('PILLAR');
  });

  it('can render just the cards, without the section heading', () => {
    TestBed.configureTestingModule({ imports: [StrategicPillars] });
    const fixture = TestBed.createComponent(StrategicPillars);
    fixture.componentRef.setInput('showHeading', false);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2')).toBeNull();
    expect(el.querySelectorAll('h3').length).toBe(4);
  });
});
