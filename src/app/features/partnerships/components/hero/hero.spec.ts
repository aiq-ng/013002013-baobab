import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PartnershipsHero } from './hero';

describe('PartnershipsHero', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PartnershipsHero] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(PartnershipsHero);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the headline and eyebrow copy', () => {
    const fixture = TestBed.createComponent(PartnershipsHero);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Partner with us for a stronger West Africa.');
    expect(text).toContain('Partnerships');
    expect(text).toContain(
      'We collaborate with governments, communities, regional institutions and international partners to build durable peace.',
    );
    expect(text).not.toContain('Track 1.5 Protocol');
  });

  it('shows the hero image with no play control or video embed', () => {
    const fixture = TestBed.createComponent(PartnershipsHero);
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img'));
    expect(img.attributes['src']).toBe('/images/partnerships/community-hands.jpg');
    expect(fixture.debugElement.query(By.css('button'))).toBeNull();
    expect(fixture.debugElement.query(By.css('iframe'))).toBeNull();
  });
});
