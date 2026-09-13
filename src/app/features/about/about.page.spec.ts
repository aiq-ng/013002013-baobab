import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AboutPage } from './about.page';

describe('AboutPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AboutPage],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(AboutPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sets the page title via SeoService on init', () => {
    const fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    const title = TestBed.inject(Title).getTitle();
    expect(title).toContain('About Us');
  });

  it('renders the hero, mission/vision panel, program grid, and theater section', () => {
    const fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Track 1.5 sovereign advisory');
    expect(text).toContain('OUR MISSION');
    expect(text).toContain('Active Programs & Theaters');
    expect(text).toContain('Liptako-Gourma Peace Corridor');
    expect(text).toContain('All Theaters');
  });
});
