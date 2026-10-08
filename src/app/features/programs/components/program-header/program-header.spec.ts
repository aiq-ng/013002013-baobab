import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProgramHeader } from './program-header';

describe('ProgramHeader', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [ProgramHeader], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProgramHeader);
    fixture.componentRef.setInput('title', 'Hybrid Mediation & Reconciliation');
    fixture.componentRef.setInput('description', 'Integrating traditional governance.');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a Programs › title breadcrumb with the current page marked', () => {
    const el = render();
    const nav = el.querySelector('nav[aria-label="Breadcrumb"]')!;
    expect(nav.querySelector('a[href="/programs"]')?.textContent).toContain('Programs');
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toContain(
      'Hybrid Mediation & Reconciliation',
    );
  });

  it('renders the title as the page h1 with the description under it', () => {
    const el = render();
    expect(el.querySelector('h1')?.textContent).toContain('Hybrid Mediation & Reconciliation');
    expect(el.textContent).toContain('Integrating traditional governance.');
  });
});
