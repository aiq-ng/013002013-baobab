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

  it('renders a Partner With Us CTA that routes to a real destination', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    fixture.detectChanges();

    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('header a'),
    );
    const cta = links.find((a) => a.textContent!.includes('Partner With Us'));
    expect(cta).toBeTruthy();
    expect(cta!.getAttribute('href')).toBe('/partnerships');
  });

  it('renders footer columns with exact copy from the design export', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    fixture.detectChanges();

    const footerText = fixture.nativeElement.querySelector('footer').textContent;
    expect(footerText).toContain('African-led Track 1.5 / Track 2 institution');
    expect(footerText).toContain('Programs');
    expect(footerText).toContain('Sovereign Dialogue Facilitation');
    expect(footerText).toContain('Policy Advisory & Regional Harmonization');
    expect(footerText).toContain('Explore');
    expect(footerText).toContain('Languages');
    expect(footerText).toContain('info@baobabgroup.org');
    expect(footerText).toContain('+225 27 22 48 88 44');
    expect(footerText).toContain('Abidjan, Côte d’Ivoire');
    expect(footerText).toContain('The Baobab Group. All rights reserved.');
  });

  it('routes every Explore link to its real page', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    fixture.detectChanges();

    const footer: HTMLElement = fixture.nativeElement.querySelector('footer');
    const hrefFor = (label: string) =>
      Array.from(footer.querySelectorAll('a'))
        .find((a) => a.textContent!.trim() === label)!
        .getAttribute('href');
    expect(hrefFor('About Us')).toBe('/about');
    expect(hrefFor('Resources')).toBe('/resources');
    expect(hrefFor('Partnerships')).toBe('/partnerships');
    expect(hrefFor('Contact Us')).toBe('/contact');
  });

  it('renders legal links as real routerLinks, never a bare "#" href', () => {
    const fixture = TestBed.createComponent(PublicLayout);
    fixture.detectChanges();

    const footer: HTMLElement = fixture.nativeElement.querySelector('footer');
    const legalLinks = Array.from(footer.querySelectorAll('a')).filter((a) =>
      ['Privacy Policy', 'Terms of Use', 'Portal Login'].includes(
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
      expect(panel.classList).toContain('animate-menu-in');

      const links = Array.from(panel.querySelectorAll('a')) as HTMLAnchorElement[];
      expect(links.length).toBe(6);
      expect(links.map((a) => a.textContent!.trim())).toContain('Partner With Us');
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
