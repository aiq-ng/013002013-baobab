import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProgramsListPage } from './programs-list.page';

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

  it('renders the hero, pillars, program grid, theater map, and dialogue form from the static fallback before the registry responds', () => {
    const fixture = TestBed.createComponent(ProgramsListPage);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain("We're building an enduring peace");
    expect(text).toContain('The Four Strategic Pillars');
    expect(text).toContain('Active Programs & Theaters');
    expect(text).toContain('Liptako-Gourma Peace Corridor');
    expect(text).toContain('All Theaters');
    expect(text).toContain('Receive Verified Field Dispatches');
    httpMock.expectOne((r) => r.url.endsWith('/programs')).flush([]);
  });

  it('renders the registry title once GET /programs responds', async () => {
    const fixture = TestBed.createComponent(ProgramsListPage);
    fixture.detectChanges();

    httpMock
      .expectOne((r) => r.url.endsWith('/programs'))
      .flush([
        {
          slug: 'liptako-gourma-peace-corridor',
          sortOrder: 0,
          title: 'Registry-Updated Corridor Title',
          description: 'Updated from the registry.',
          imageUrl: '/images/updated.jpg',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Registry-Updated Corridor Title');
  });
});
