import { TestBed } from '@angular/core/testing';
import { TrustBand } from './trust-band';

describe('TrustBand', () => {
  it('renders the four trust claims', () => {
    TestBed.configureTestingModule({ imports: [TrustBand] });
    const fixture = TestBed.createComponent(TrustBand);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('African-Led');
    expect(text).toContain('Trusted By Communities');
    expect(text).toContain('Bridges ECOWAS and AES');
    expect(text).toContain('Confidential and Results-Oriented');
  });
});
