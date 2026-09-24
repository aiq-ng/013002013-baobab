import { TestBed } from '@angular/core/testing';
import { TableSkeleton } from './table-skeleton';

describe('TableSkeleton', () => {
  it('renders the requested number of placeholder rows inside a polite status region', () => {
    TestBed.configureTestingModule({ imports: [TableSkeleton] });
    const fixture = TestBed.createComponent(TableSkeleton);
    fixture.componentRef.setInput('rows', 3);
    fixture.componentRef.setInput('label', 'Loading programs');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('[role="status"]')?.textContent).toContain('Loading programs');
    expect(el.querySelectorAll('[data-skeleton-row]').length).toBe(3);
  });
});
