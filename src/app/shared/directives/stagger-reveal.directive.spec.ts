import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { STAGGER_STEP_MS, StaggerRevealDirective } from './stagger-reveal.directive';

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly elements = new Set<Element>();
  options: IntersectionObserverInit | undefined;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.options = options;
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

  emit(targets: Element[]): void {
    this.callback(
      targets.map((target) => ({ target, isIntersecting: true }) as IntersectionObserverEntry),
      this as unknown as IntersectionObserver,
    );
  }
}

@Component({
  standalone: true,
  imports: [StaggerRevealDirective],
  template: `<ul appStaggerReveal>
    <li>a</li>
    <li>b</li>
    <li>c</li>
    <li>d</li>
  </ul>`,
})
class HostComponent {}

/** Places each child at a fake on-screen position so row/column detection can be tested. */
function layOut(items: HTMLElement[], tops: number[]): void {
  items.forEach((item, i) => {
    item.getBoundingClientRect = () => ({ top: tops[i] }) as DOMRect;
  });
}

describe('StaggerRevealDirective', () => {
  let originalIntersectionObserver: typeof IntersectionObserver;
  let originalMatchMedia: typeof window.matchMedia;
  let originalRect: typeof HTMLElement.prototype.getBoundingClientRect;

  beforeEach(() => {
    originalRect = HTMLElement.prototype.getBoundingClientRect;
    // Default: everything starts below the fold, so it is hidden and waits to scroll in.
    HTMLElement.prototype.getBoundingClientRect = () => ({ top: 5000, bottom: 5100 }) as DOMRect;
    originalIntersectionObserver = window.IntersectionObserver;
    originalMatchMedia = window.matchMedia;
    FakeIntersectionObserver.instances = [];
    window.IntersectionObserver =
      FakeIntersectionObserver as unknown as typeof IntersectionObserver;
    window.matchMedia = ((query: string) =>
      ({ matches: false, media: query }) as MediaQueryList) as typeof window.matchMedia;
  });

  afterEach(() => {
    HTMLElement.prototype.getBoundingClientRect = originalRect;
    window.IntersectionObserver = originalIntersectionObserver;
    window.matchMedia = originalMatchMedia;
  });

  function setup(): { fixture: ComponentFixture<HostComponent>; items: HTMLElement[] } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const items = Array.from(fixture.nativeElement.querySelectorAll('li')) as HTMLElement[];
    return { fixture, items };
  }

  it('uses a 150ms step between columns', () => {
    expect(STAGGER_STEP_MS).toBe(150);
  });

  it('can reveal columns sitting at the very bottom of the page (no negative bottom margin)', () => {
    setup();
    const margin = FakeIntersectionObserver.instances[0].options?.rootMargin ?? '0px';
    expect(margin).not.toMatch(/-/);
  });

  it('leaves columns already on screen at load visible, without a flash or animation', () => {
    HTMLElement.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 200 }) as DOMRect;

    const { items } = setup();

    for (const item of items) {
      expect(item.classList).not.toContain('stagger-item');
    }
  });

  it('hands each column back its own transitions once its reveal has finished', () => {
    const { items } = setup();
    layOut(items, [0, 0, 0, 0]);
    FakeIntersectionObserver.instances[0].emit([items[1]]);

    items[1].dispatchEvent(new Event('transitionend'));

    expect(items[1].classList).not.toContain('stagger-item');
    expect(items[1].classList).not.toContain('is-visible');
    expect(items[1].style.transitionDelay).toBe('');
  });

  it('hides every column until it scrolls into view', () => {
    const { items } = setup();
    for (const item of items) {
      expect(item.classList).toContain('stagger-item');
      expect(item.classList).not.toContain('is-visible');
    }
  });

  it('delays each column by its position in the visual row, restarting on each new row', () => {
    const { items } = setup();
    layOut(items, [0, 0, 0, 300]); // three columns, then a wrapped fourth item

    FakeIntersectionObserver.instances[0].emit(items);

    expect(items.map((i) => i.style.transitionDelay)).toEqual(['0ms', '150ms', '300ms', '0ms']);
    for (const item of items) {
      expect(item.classList).toContain('is-visible');
    }
  });

  it('gives stacked single-column (mobile) items no delay', () => {
    const { items } = setup();
    layOut(items, [0, 200, 400, 600]);

    FakeIntersectionObserver.instances[0].emit(items);

    expect(items.map((i) => i.style.transitionDelay)).toEqual(['0ms', '0ms', '0ms', '0ms']);
  });

  it('stops observing a column once it has been revealed', () => {
    const { items } = setup();
    layOut(items, [0, 0, 0, 0]);
    const observer = FakeIntersectionObserver.instances[0];

    observer.emit([items[0]]);

    expect(observer.elements.has(items[0])).toBe(false);
    expect(observer.elements.has(items[1])).toBe(true);
  });

  it('reveals everything immediately when the user prefers reduced motion', () => {
    window.matchMedia = ((query: string) =>
      ({ matches: true, media: query }) as MediaQueryList) as typeof window.matchMedia;

    const { items } = setup();

    expect(FakeIntersectionObserver.instances.length).toBe(0);
    for (const item of items) {
      expect(item.classList).not.toContain('stagger-item');
    }
  });

  it('never hides content on the server', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });

    const { items } = setup();

    for (const item of items) {
      expect(item.classList).not.toContain('stagger-item');
    }
  });
});
