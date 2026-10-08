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
  it('renders the resolved program (header, principles, about, strategy, subscribe band)', () => {
    configureWithResolved(makeProgram());
    const fixture = TestBed.createComponent(ProgramDetailPage);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Hybrid Mediation & Reconciliation');
    expect(el.textContent).toContain('State primacy');
    expect(el.textContent).not.toContain('Four principles');
    expect(el.textContent).toContain('About this program:');
    expect(el.textContent).toContain('Second about paragraph.');
    expect(el.textContent).toContain('Complements legitimate security efforts');
    expect(el.textContent).toContain('Preventing conflict and community stabilization.');
    expect(el.textContent).toContain('Receive new publications and updates from The Baobab Group.');
    expect(el.querySelector('button[type="submit"]')?.textContent).toContain('Subscribe');
  });

  it('sets the page title and description via SeoService on init', () => {
    configureWithResolved(makeProgram());
    const fixture = TestBed.createComponent(ProgramDetailPage);
    fixture.detectChanges();
    expect(TestBed.inject(Title).getTitle()).toContain('Hybrid Mediation & Reconciliation');
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
