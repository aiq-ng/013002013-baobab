import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { Button } from './button';
import { AnalyticsService } from '../../../core/services/analytics.service';

describe('Button', () => {
  let trackCtaClick: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    trackCtaClick = vi.fn();
    TestBed.configureTestingModule({
      imports: [Button],
      providers: [provideRouter([]), { provide: AnalyticsService, useValue: { trackCtaClick } }],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(Button);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a real anchor when given a routerLink', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Strategic Partnerships';
    fixture.componentInstance.routerLink = '/contact';
    fixture.detectChanges();

    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor).toBeTruthy();
    expect(anchor.nativeElement.textContent).toContain('Strategic Partnerships');
    expect(fixture.debugElement.query(By.css('button'))).toBeFalsy();
  });

  it('renders a real button and emits pressed when no routerLink is given', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Initiate Dialogue';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();

    let pressed = false;
    fixture.componentInstance.pressed.subscribe(() => (pressed = true));
    button.nativeElement.click();
    expect(pressed).toBe(true);
  });

  it('emits pressed when the routed anchor form is clicked', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Strategic Partnerships';
    fixture.componentInstance.routerLink = '/partnerships';
    fixture.detectChanges();

    let pressed = false;
    fixture.componentInstance.pressed.subscribe(() => (pressed = true));
    // Invoke the anchor's own handler directly: clicking the RouterLink would kick off a
    // real navigation that outlives the fixture.
    expect(fixture.debugElement.query(By.css('a'))).toBeTruthy();
    fixture.componentInstance.onRoutedClick();

    expect(pressed).toBe(true);
  });

  it('applies the primary variant class by default', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Go';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('button, a');
    expect(el.className).toContain('bg-brand-600');
  });

  it('applies the secondary/outline variant class when requested', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Download Doctrine Dossier';
    fixture.componentInstance.variant = 'secondary';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('button, a');
    expect(el.className).not.toContain('bg-brand-600');
  });

  it('applies the light variant class when requested', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Learn more';
    fixture.componentInstance.variant = 'light';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('button, a');
    expect(el.className).toContain('bg-white');
  });

  it('tracks a CTA click via AnalyticsService when ctaId is set and routerLink is used', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Strategic Partnerships';
    fixture.componentInstance.routerLink = '/partnerships';
    fixture.componentInstance.ctaId = 'strategic-partnerships';
    fixture.detectChanges();

    fixture.componentInstance.onRoutedClick();
    expect(trackCtaClick).toHaveBeenCalledWith('strategic-partnerships');
  });

  it('tracks a CTA click via AnalyticsService when ctaId is set on a plain button', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Initiate Dialogue';
    fixture.componentInstance.ctaId = 'home-dialogue-open';
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    expect(trackCtaClick).toHaveBeenCalledWith('home-dialogue-open');
  });

  it('does not call AnalyticsService when ctaId is not set', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Go';
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    expect(trackCtaClick).not.toHaveBeenCalled();
  });

  it('renders a plain anchor with the download attribute when given an href to download', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Download Dossier PDF';
    fixture.componentInstance.href = '/documents/review.pdf';
    fixture.componentInstance.download = true;
    fixture.detectChanges();

    const anchor: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(anchor.getAttribute('href')).toBe('/documents/review.pdf');
    expect(anchor.hasAttribute('download')).toBe(true);
    expect(fixture.debugElement.query(By.css('button'))).toBeFalsy();
  });

  it('omits the download attribute for a plain href link and tracks its CTA id', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'View Document Online';
    fixture.componentInstance.href = '/documents/review.html';
    fixture.componentInstance.ctaId = 'resources-view-review';
    fixture.detectChanges();

    const anchor: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(anchor.hasAttribute('download')).toBe(false);
    anchor.click();
    expect(trackCtaClick).toHaveBeenCalledWith('resources-view-review');
  });

  it('disables the button element when disabled is true', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentInstance.label = 'Go';
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBe(true);
  });
});
