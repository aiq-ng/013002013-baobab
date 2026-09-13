import { TestBed } from '@angular/core/testing';
import { OperationalPillars } from './operational-pillars';

describe('OperationalPillars', () => {
  it('renders the heading, description, and all 3 pillars', () => {
    TestBed.configureTestingModule({ imports: [OperationalPillars] });
    const fixture = TestBed.createComponent(OperationalPillars);
    fixture.componentRef.setInput('eyebrow', 'GOVERNANCE ARCHITECTURE');
    fixture.componentRef.setInput('heading', 'Codified Operational Pillars');
    fixture.componentRef.setInput('description', 'Tri-partite regulatory foundations.');
    fixture.componentRef.setInput('pillars', [
      {
        icon: '🕒',
        eyebrow: 'PILLAR I',
        title: 'Rotational Clocks',
        description: 'A',
        footnote: 'X',
      },
      { icon: '🤝', eyebrow: 'PILLAR II', title: 'Conciliation', description: 'B', footnote: 'Y' },
      {
        icon: '🏗️',
        eyebrow: 'PILLAR III',
        title: 'Aquifer Recharge',
        description: 'C',
        footnote: 'Z',
      },
    ]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Codified Operational Pillars');
    expect(text).toContain('Rotational Clocks');
    expect(text).toContain('Conciliation');
    expect(text).toContain('Aquifer Recharge');
  });
});
