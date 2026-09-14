import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollRevealDirective } from './scroll-reveal.directive';

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly elements = new Set<Element>();

  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.elements.add(target);
  }

  unobserve(target: Element): void {
    this.elements.delete(target);
  }

  disconnect(): void {
    this.elements.clear();
  }

  emitIntersecting(target: Element): void {
    this.callback(
      [{ target, isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

@Component({
  standalone: true,
  imports: [ScrollRevealDirective],
  template: `<div appScrollReveal>content</div>`,
})
class HostComponent {}

describe('ScrollRevealDirective', () => {
  let originalIntersectionObserver: typeof IntersectionObserver;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalIntersectionObserver = window.IntersectionObserver;
    originalMatchMedia = window.matchMedia;
    FakeIntersectionObserver.instances = [];
    window.IntersectionObserver =
      FakeIntersectionObserver as unknown as typeof IntersectionObserver;
    window.matchMedia = ((query: string) =>
      ({ matches: false, media: query }) as MediaQueryList) as typeof window.matchMedia;
  });

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver;
    window.matchMedia = originalMatchMedia;
  });

  function createFixture(): ComponentFixture<HostComponent> {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('adds the scroll-reveal host class immediately', () => {
    const fixture = createFixture();
    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(el.classList.contains('scroll-reveal')).toBe(true);
    expect(el.classList.contains('is-visible')).toBe(false);
  });

  it('adds is-visible once the element intersects the viewport', () => {
    const fixture = createFixture();
    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    const observer = FakeIntersectionObserver.instances[0];

    observer.emitIntersecting(el);

    expect(el.classList.contains('is-visible')).toBe(true);
  });

  it('stops observing the element after it has been revealed once', () => {
    const fixture = createFixture();
    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    const observer = FakeIntersectionObserver.instances[0];

    observer.emitIntersecting(el);

    expect(observer.elements.has(el)).toBe(false);
  });

  it('reveals immediately when the user prefers reduced motion', () => {
    window.matchMedia = ((query: string) =>
      ({ matches: true, media: query }) as MediaQueryList) as typeof window.matchMedia;

    const fixture = createFixture();
    const el: HTMLElement = fixture.nativeElement.querySelector('div');

    expect(el.classList.contains('is-visible')).toBe(true);
    expect(FakeIntersectionObserver.instances.length).toBe(0);
  });

  it('reveals immediately on the server (no IntersectionObserver, no hidden SSR output)', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });

    const fixture = createFixture();
    const el: HTMLElement = fixture.nativeElement.querySelector('div');

    expect(el.classList.contains('is-visible')).toBe(true);
  });
});
