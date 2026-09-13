import { TestBed } from '@angular/core/testing';
import { Badge } from './badge';

describe('Badge', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Badge] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(Badge);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the given text', () => {
    const fixture = TestBed.createComponent(Badge);
    fixture.componentInstance.text = 'SOVEREIGNTY MATRIX';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('SOVEREIGNTY MATRIX');
  });

  it('defaults to the default variant class', () => {
    const fixture = TestBed.createComponent(Badge);
    fixture.componentInstance.text = 'KNOW ABOUT US';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('span')?.className).toContain('text-brand-700');
  });

  it('applies the accent-on-dark variant', () => {
    const fixture = TestBed.createComponent(Badge);
    fixture.componentInstance.text = 'Continuous Operational Feed';
    fixture.componentInstance.variant = 'accent-on-dark';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('span')?.className).toContain('bg-brand-800');
  });
});
