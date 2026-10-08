import { TestBed } from '@angular/core/testing';
import { PartnershipsFeatureCards } from './feature-cards';

describe('PartnershipsFeatureCards', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PartnershipsFeatureCards] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(PartnershipsFeatureCards);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders all three partner-group cards with title and description', () => {
    const fixture = TestBed.createComponent(PartnershipsFeatureCards);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Governments and regional bodies');
    expect(text).toContain('Governments and Local Authorities, ECOWAS, AES and AU.');
    expect(text).toContain('Communities and institutions');
    expect(text).toContain(
      'Traditional and Religious Institutions, and Civil Society and Community Organizations.',
    );
    expect(text).toContain('International partners and donors');
    expect(text).toContain(
      'UN Agencies and International Partners, and Development Partners and Donors.',
    );
  });

  it('no longer renders card link labels', () => {
    const fixture = TestBed.createComponent(PartnershipsFeatureCards);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('Tier 1 Interoperability');
  });
});
