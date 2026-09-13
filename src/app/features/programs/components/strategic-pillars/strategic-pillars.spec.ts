import { TestBed } from '@angular/core/testing';
import { StrategicPillars } from './strategic-pillars';

describe('StrategicPillars', () => {
  it('renders all 4 pillars', () => {
    TestBed.configureTestingModule({ imports: [StrategicPillars] });
    const fixture = TestBed.createComponent(StrategicPillars);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('The Four Strategic Pillars');
    expect(text).toContain('Transhumance Corridors');
    expect(text).toContain('Customary Jurisprudence');
    expect(text).toContain('Restorative Security');
    expect(text).toContain('Cross-Border Security');
  });
});
