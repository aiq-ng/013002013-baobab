import { TestBed } from '@angular/core/testing';
import { KpiGrid } from './kpi-grid';

describe('KpiGrid', () => {
  it('renders all 4 KPI cards', () => {
    TestBed.configureTestingModule({ imports: [KpiGrid] });
    const fixture = TestBed.createComponent(KpiGrid);
    fixture.componentRef.setInput('kpis', [
      { value: '3', unit: 'Systems', label: 'Niger River Bend, Béli Basin' },
      {
        value: '46',
        unit: 'Boreholes',
        label: 'Fulani Pastoralists & Dogon Agrarian Guild Accords',
      },
      { value: '0', unit: 'Clashes', label: 'Across 34 monitored boreholes' },
      { value: '142,000', label: 'Head vaccinated bi-annually' },
    ]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('3');
    expect(text).toContain('Systems');
    expect(text).toContain('46');
    expect(text).toContain('142,000');
  });
});
