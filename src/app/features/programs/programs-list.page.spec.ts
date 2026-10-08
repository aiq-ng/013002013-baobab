import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProgramsListPage } from './programs-list.page';
import { makeProgram } from './testing/program-fixture';

describe('ProgramsListPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProgramsListPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(ProgramsListPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sets the page title via SeoService on init', () => {
    const fixture = TestBed.createComponent(ProgramsListPage);
    fixture.detectChanges();
    expect(TestBed.inject(Title).getTitle()).toContain('Programs');
    httpMock.expectOne((r) => r.url.endsWith('/programs')).flush([]);
  });

  it('renders the hero, trust band, principles, and subscribe band while the registry loads', () => {
    const fixture = TestBed.createComponent(ProgramsListPage);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('We support dialogue, mediation');
    expect(text).toContain('African-Led');
    expect(text).toContain('Four principles');
    expect(text).toContain('Programs and Services');
    expect(text).toContain('Active Programs & Theaters');
    expect(text).not.toContain('All Theaters');
    expect(text).toContain('Receive new publications and updates from The Baobab Group.');
    expect(text).toContain('Subscribe');
    httpMock.expectOne((r) => r.url.endsWith('/programs')).flush([]);
  });

  it('renders exactly the programs GET /programs returns', async () => {
    const fixture = TestBed.createComponent(ProgramsListPage);
    fixture.detectChanges();

    httpMock
      .expectOne((r) => r.url.endsWith('/programs'))
      .flush([makeProgram({ slug: 'new-one', title: 'A Program Created In The Console' })]);
    await fixture.whenStable();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('A Program Created In The Console');
    expect(el.querySelector('a[href="/programs/new-one"]')).toBeTruthy();
  });

  it('says programs are unavailable when the registry cannot be reached', async () => {
    const fixture = TestBed.createComponent(ProgramsListPage);
    fixture.detectChanges();

    httpMock
      .expectOne((r) => r.url.endsWith('/programs'))
      .flush('down', { status: 503, statusText: 'Service Unavailable' });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('temporarily unavailable');
  });
});
