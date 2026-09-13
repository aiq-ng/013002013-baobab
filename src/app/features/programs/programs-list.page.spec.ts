import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProgramsListPage } from './programs-list.page';

describe('ProgramsListPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProgramsListPage],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(ProgramsListPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sets the page title via SeoService on init', () => {
    const fixture = TestBed.createComponent(ProgramsListPage);
    fixture.detectChanges();
    expect(TestBed.inject(Title).getTitle()).toContain('Programs');
  });

  it('renders the hero, pillars, program grid, theater map, and dialogue form', () => {
    const fixture = TestBed.createComponent(ProgramsListPage);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain("We're building an enduring peace");
    expect(text).toContain('The Four Strategic Pillars');
    expect(text).toContain('Active Programs & Theaters');
    expect(text).toContain('Liptako-Gourma Peace Corridor');
    expect(text).toContain('All Theaters');
    expect(text).toContain('Receive Verified Field Dispatches');
  });
});
