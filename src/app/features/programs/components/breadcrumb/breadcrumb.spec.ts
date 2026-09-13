import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProgramBreadcrumb } from './breadcrumb';

describe('ProgramBreadcrumb', () => {
  it('renders the trail, status badge, and reference/clearance metadata', () => {
    TestBed.configureTestingModule({
      imports: [ProgramBreadcrumb],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(ProgramBreadcrumb);
    fixture.componentRef.setInput('theater', 'Sahel Central');
    fixture.componentRef.setInput('title', 'Gourma Pastoral Wells');
    fixture.componentRef.setInput('statusTag', 'ACTIVE HYDRAULIC ACCORD');
    fixture.componentRef.setInput('referenceCode', 'REF: BO-GOU-2024-H2O');
    fixture.componentRef.setInput('clearanceLevel', 'DIPLOMATIC CLEARANCE L1');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Programs');
    expect(text).toContain('Sahel Central');
    expect(text).toContain('Gourma Pastoral Wells');
    expect(text).toContain('ACTIVE HYDRAULIC ACCORD');
    expect(text).toContain('REF: BO-GOU-2024-H2O');
    expect(text).toContain('DIPLOMATIC CLEARANCE L1');
  });
});
