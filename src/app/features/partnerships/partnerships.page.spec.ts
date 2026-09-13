import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { PartnershipsPage } from './partnerships.page';

describe('PartnershipsPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PartnershipsPage],
      providers: [provideRouter([]), Title, Meta],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(PartnershipsPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sets page SEO metadata', () => {
    const fixture = TestBed.createComponent(PartnershipsPage);
    fixture.detectChanges();
    const title = TestBed.inject(Title);
    expect(title.getTitle()).toContain('Partnerships');
  });

  it('renders the hero, feature cards, dialogue form, and partner logo strip', () => {
    const fixture = TestBed.createComponent(PartnershipsPage);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Partnering to Anchor Enduring Sovereign Peace');
    expect(text).toContain('Multilateral Missions');
    expect(text).toContain('Initiate Sovereign Partnership Dialogue');
  });
});
