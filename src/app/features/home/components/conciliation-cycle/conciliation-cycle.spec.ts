import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConciliationCycle } from './conciliation-cycle';

describe('ConciliationCycle', () => {
  let fixture: ComponentFixture<ConciliationCycle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConciliationCycle],
    }).compileComponents();
    fixture = TestBed.createComponent(ConciliationCycle);
    fixture.detectChanges();
  });

  it('renders the heading and "Continuous Operational Feed" badge', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Integrated Conciliation Cycle');
    expect(el.textContent).toContain('Continuous Operational Feed');
  });

  it('renders all 4 numbered steps in order', () => {
    expect(fixture.componentInstance.steps.map((s) => s.title)).toEqual([
      'Customary Inquest',
      'Track 1.5 Drafting',
      'Ministerial Clearance',
      'Sovereign Stabilization',
    ]);
  });
});
