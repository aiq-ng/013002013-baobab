import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImpactStats } from './impact-stats';

describe('ImpactStats', () => {
  let fixture: ComponentFixture<ImpactStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpactStats],
    }).compileComponents();
    fixture = TestBed.createComponent(ImpactStats);
    fixture.detectChanges();
  });

  it('renders all 4 impact stats with value, label, and supporting description', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('1.4k+');
    expect(el.textContent).toContain('Grassroots Pacts Mediated');
    expect(el.textContent).toContain('Enforced under customary jurisprudence');
    expect(el.textContent).toContain('100%');
    expect(el.textContent).toContain('480');
    expect(el.textContent).toContain('14');
    expect(el.textContent).toContain('Sovereign Nations');
  });
});
