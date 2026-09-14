import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BackLink } from './back-link';

describe('BackLink', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [BackLink], providers: [provideRouter([])] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(BackLink);
    fixture.componentInstance.routerLink = '/programs';
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults the label to "Back"', () => {
    const fixture = TestBed.createComponent(BackLink);
    fixture.componentInstance.routerLink = '/programs';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Back');
  });

  it('renders a custom label', () => {
    const fixture = TestBed.createComponent(BackLink);
    fixture.componentInstance.routerLink = '/contact';
    fixture.componentInstance.label = 'Back to Contact';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Back to Contact');
  });

  it('links to the given route', () => {
    const fixture = TestBed.createComponent(BackLink);
    fixture.componentInstance.routerLink = '/programs';
    fixture.detectChanges();
    const anchor: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(anchor.getAttribute('href')).toBe('/programs');
  });
});
