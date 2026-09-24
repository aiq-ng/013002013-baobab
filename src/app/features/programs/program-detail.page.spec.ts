import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProgramDetailPage } from './program-detail.page';
import { Program } from './models/program';
import { makeProgram } from './testing/program-fixture';

function configureWithResolved(program: Program | null) {
  TestBed.configureTestingModule({
    imports: [ProgramDetailPage],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: ActivatedRoute, useValue: { snapshot: { data: { program } } } },
    ],
  });
}

describe('ProgramDetailPage', () => {
  it('renders the resolved program (hero, KPIs, doctrine, pillars, timeline, dispatch form)', () => {
    configureWithResolved(makeProgram());
    const fixture = TestBed.createComponent(ProgramDetailPage);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Gourma Pastoral Wells & Riparian Demarcation');
    expect(text).toContain('ACTIVE HYDRAULIC ACCORD');
    expect(text).toContain('Codified Water Sharing and Seasonal Grazing Harmony');
    expect(text).toContain('Hydraulic Rotational Clocks');
    expect(text).toContain('Hombori Basin Water Allocation Framework Ratified');
    expect(text).toContain('Request Confidential Addenda & Aquifer Telemetry Data');
  });

  it('sets the page title via SeoService on init', () => {
    configureWithResolved(makeProgram());
    const fixture = TestBed.createComponent(ProgramDetailPage);
    fixture.detectChanges();
    expect(TestBed.inject(Title).getTitle()).toContain(
      'Gourma Pastoral Wells & Riparian Demarcation',
    );
  });

  it('shows an unavailable state with a way back when the registry could not be reached', () => {
    configureWithResolved(null);
    const fixture = TestBed.createComponent(ProgramDetailPage);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('article')).toBeFalsy();
    expect(el.textContent).toContain('temporarily unavailable');
    expect(el.querySelector('a[href="/programs"]')).toBeTruthy();
  });
});
