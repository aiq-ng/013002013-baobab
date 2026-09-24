import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AboutPage } from './about.page';
import { makeProgram } from '../programs/testing/program-fixture';

describe('AboutPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AboutPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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
    httpMock.expectOne((r) => r.url.endsWith('/programs')).flush([]);
  });

  it('renders the hero, mission/vision panel, program grid, and theater section', () => {
    const fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Track 1.5 sovereign advisory');
    expect(text).toContain('OUR MISSION');
    expect(text).toContain('Active Programs & Theaters');
    expect(text).toContain('All Theaters');
    httpMock.expectOne((r) => r.url.endsWith('/programs')).flush([]);
  });

  it('fills the program grid from GET /programs', async () => {
    const fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    httpMock
      .expectOne((r) => r.url.endsWith('/programs'))
      .flush([makeProgram({ title: 'Registry Program Title' })]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Registry Program Title');
  });
});
