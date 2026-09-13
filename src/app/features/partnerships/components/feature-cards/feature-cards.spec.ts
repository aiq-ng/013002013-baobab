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

  it('renders all three feature cards with title and link text', () => {
    const fixture = TestBed.createComponent(PartnershipsFeatureCards);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Multilateral Missions');
    expect(text).toContain('Customary Legitimacy');
    expect(text).toContain('Zero Kinetic Escalation');
    expect(text).toContain('Tier 1 Interoperability');
    expect(text).toContain('Ancestral Jurisprudence');
    expect(text).toContain('Sahelian Corridors');
  });
});
