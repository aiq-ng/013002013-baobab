import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ProgramGrid, ProgramPreview } from './program-grid';

const PROGRAMS: ProgramPreview[] = [
  {
    slug: 'liptako-gourma',
    badgeText: 'SAHEL CENTRAL',
    imageUrl: '/images/about/program-liptako-gourma.jpg',
    imageAlt: 'A border crossing arch',
    title: 'Liptako-Gourma Peace Corridor',
    description: 'Establishment of bi-annual customary transit protocols.',
  },
  {
    slug: 'lake-chad-basin',
    badgeText: 'LAKE CHAD BASIN',
    imageUrl: '/images/about/program-lake-chad.jpg',
    imageAlt: 'A community gathering under a tree',
    title: 'Lake Chad Customary Demobilization',
    description: 'Traditional emirate truth-telling circles and reintegration.',
  },
];

describe('ProgramGrid', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProgramGrid],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(ProgramGrid);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a card per program with title, badge, and a Learn more link to the program route', () => {
    const fixture = TestBed.createComponent(ProgramGrid);
    fixture.componentInstance.programs = PROGRAMS;
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Liptako-Gourma Peace Corridor');
    expect(text).toContain('Lake Chad Customary Demobilization');
    expect(text).toContain('SAHEL CENTRAL');

    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    const hrefs = links.map((l) => l.injector.get(RouterLink).href);
    expect(hrefs).toContain('/programs/liptako-gourma');
    expect(hrefs).toContain('/programs/lake-chad-basin');
  });
});
