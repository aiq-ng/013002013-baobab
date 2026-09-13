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
    expect(text).toContain(
      'Partnering to Anchor Enduring Sovereign Peace Across West Africa and the Sahel.',
    );
    expect(text).toContain('Strategic Alliances & Sovereign Mandates');
  });

  it('shows a poster image with a labelled play control before playing', () => {
    const fixture = TestBed.createComponent(PartnershipsHero);
    fixture.detectChanges();
    const playButton = fixture.debugElement.query(By.css('button'));
    expect(playButton).toBeTruthy();
    expect(playButton.attributes['aria-label']).toContain('Play');
    expect(fixture.componentInstance.isPlaying()).toBe(false);
  });

  it('switches to the video element when the play control is activated', () => {
    const fixture = TestBed.createComponent(PartnershipsHero);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.isPlaying()).toBe(true);
    expect(fixture.debugElement.query(By.css('video'))).toBeTruthy();
  });
});
