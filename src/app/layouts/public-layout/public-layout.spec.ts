import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PublicLayout } from './public-layout';

describe('PublicLayout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PublicLayout],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('exposes the five primary nav links in site-map order', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    const labels = fixture.componentInstance.navLinks.map((l) => l.label);

    expect(labels).toEqual(['Home', 'Programs', 'Resources', 'About Us', 'Contact Us']);
  });

  it('renders a nav link for every entry', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('[data-testid="desktop-nav"] a');
    expect(links.length).toBe(5);
  });

  it('renders the current year in the footer', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    fixture.detectChanges();

    const footerText = fixture.nativeElement.querySelector('footer').textContent;
    expect(footerText).toContain(String(new Date().getFullYear()));
  });

  it('renders a Strategic Partnerships CTA that routes to a real destination', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    fixture.detectChanges();

    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('header a'),
    );
    const cta = links.find((a) => a.textContent!.includes('Strategic Partnerships'));
    expect(cta).toBeTruthy();
    expect(cta!.getAttribute('href')).toBe('/partnerships');
  });

  it('renders footer columns with exact copy from the design export', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    fixture.detectChanges();

    const footerText = fixture.nativeElement.querySelector('footer').textContent;
    expect(footerText).toContain('Thematic Focus');
    expect(footerText).toContain('Transhumance Grazing Pacts');
    expect(footerText).toContain('Regional Hubs');
    expect(footerText).toContain('Dakar');
    expect(footerText).toContain('Doctrine & Records');
    expect(footerText).toContain('Annual Statecraft Review (2024–2025)');
    expect(footerText).toContain('secretar@baobab-dialogue.org');
    expect(footerText).toContain('+221 33 820 00 44');
  });

  it('renders legal links as real routerLinks, never a bare "#" href', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    fixture.detectChanges();

    const footer: HTMLElement = fixture.nativeElement.querySelector('footer');
    const legalLinks = Array.from(footer.querySelectorAll('a')).filter((a) =>
      ['Security Protocol', 'Diplomatic Status', 'Portal Login'].includes(
        (a as HTMLAnchorElement).textContent!.trim(),
      ),
    ) as HTMLAnchorElement[];

    expect(legalLinks.length).toBe(3);
    legalLinks.forEach((link) => {
      expect(link.getAttribute('href')).toBeTruthy();
      expect(link.getAttribute('href')).not.toBe('#');
    });
  });

  describe('mobile navigation', () => {
    it('renders a menu toggle button that is hidden on desktop', () => {
      const fixture = TestBed.createComponent(PublicLayout);
      fixture.detectChanges();

      const toggle: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[data-testid="mobile-menu-toggle"]',
      );
      expect(toggle).toBeTruthy();
      expect(toggle.className).toContain('md:hidden');
      expect(toggle.getAttribute('aria-label')).toBeTruthy();
    });

    it('keeps the mobile panel closed by default', () => {
      const fixture = TestBed.createComponent(PublicLayout);
      fixture.detectChanges();

      expect(fixture.componentInstance.menuOpen()).toBe(false);
      expect(fixture.nativeElement.querySelector('[data-testid="mobile-nav"]')).toBeNull();
    });

    it('opens the panel with every nav link plus the partnerships CTA when toggled', () => {
      const fixture = TestBed.createComponent(PublicLayout);
      fixture.detectChanges();

      const toggle: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[data-testid="mobile-menu-toggle"]',
      );
      toggle.click();
      fixture.detectChanges();

      const panel: HTMLElement = fixture.nativeElement.querySelector('[data-testid="mobile-nav"]');
      expect(panel).toBeTruthy();

      const links = Array.from(panel.querySelectorAll('a')) as HTMLAnchorElement[];
      expect(links.length).toBe(6);
      expect(links.map((a) => a.textContent!.trim())).toContain('Strategic Partnerships');
    });

    it('reflects open state on the toggle for assistive technology', () => {
      const fixture = TestBed.createComponent(PublicLayout);
      fixture.detectChanges();

      const toggle: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[data-testid="mobile-menu-toggle"]',
      );
      expect(toggle.getAttribute('aria-expanded')).toBe('false');

      toggle.click();
      fixture.detectChanges();
      expect(toggle.getAttribute('aria-expanded')).toBe('true');

      toggle.click();
      fixture.detectChanges();
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
    });

    it('closes the panel when a nav link inside it is followed', () => {
      const fixture = TestBed.createComponent(PublicLayout);
      fixture.detectChanges();

      fixture.componentInstance.toggleMenu();
      fixture.detectChanges();

      const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
        '[data-testid="mobile-nav"] a',
      );
      link.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.menuOpen()).toBe(false);
      expect(fixture.nativeElement.querySelector('[data-testid="mobile-nav"]')).toBeNull();
    });
  });
});
