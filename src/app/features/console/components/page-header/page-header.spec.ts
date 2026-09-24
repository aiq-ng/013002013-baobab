import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PageHeader } from './page-header';

@Component({
  standalone: true,
  imports: [PageHeader],
  template: `<app-console-page-header
    eyebrow="Secretariat repositories"
    title="Programs"
    meta="6 strategic portfolios"
    backLink="/console/programs"
    backLabel="Programs"
  >
    <button actions type="button">New</button>
  </app-console-page-header>`,
})
class Host {}

describe('PageHeader', () => {
  function setup(): HTMLElement {
    TestBed.configureTestingModule({ imports: [Host], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('renders the page title as the single h1', () => {
    const el = setup();
    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent).toContain('Programs');
  });

  it('renders eyebrow, meta and projected actions', () => {
    const el = setup();
    expect(el.textContent).toContain('Secretariat repositories');
    expect(el.textContent).toContain('6 strategic portfolios');
    expect(el.querySelector('button')?.textContent).toContain('New');
  });

  it('renders a back link to the parent collection', () => {
    const el = setup();
    const back = el.querySelector('a') as HTMLAnchorElement;
    expect(back.getAttribute('href')).toBe('/console/programs');
    expect(back.textContent).toContain('Programs');
  });
});
