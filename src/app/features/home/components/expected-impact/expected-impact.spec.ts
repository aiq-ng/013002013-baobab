import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpectedImpact } from './expected-impact';

describe('ExpectedImpact', () => {
  let fixture: ComponentFixture<ExpectedImpact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpectedImpact],
    }).compileComponents();
    fixture = TestBed.createComponent(ExpectedImpact);
    fixture.detectChanges();
  });

  it('renders the section heading', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('WHAT WE CAN DO');
    expect(el.textContent).toContain('Expected impact');
  });

  it('renders the 6 numbered impact outcomes in order', () => {
    const items: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('li'));
    expect(items.length).toBe(6);
    expect(items.map((li) => li.textContent!.replace(/\s+/g, ' ').trim())).toEqual([
      '01 Reduced violence and improved community security',
      '02 Stronger trust between states and communities',
      '03 Improved governance and social inclusion',
      '04 Humanitarian access and protection of civilians.',
      '05 Pathways for disengagement and reintegration.',
      '06 A more cohesive and stable West Africa.',
    ]);
  });
});
