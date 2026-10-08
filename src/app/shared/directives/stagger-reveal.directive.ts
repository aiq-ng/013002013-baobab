import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Delay between neighbouring columns in the same visual row. */
export const STAGGER_STEP_MS = 150;

/**
 * Put on any multi-column row (grid or flex). Each direct child fades/lifts in as it scrolls into
 * view, delayed by its column position within its visual row — so a row builds left to right, the
 * count restarts on every wrapped row, and stacked mobile layouts get no delay at all.
 * Like [appScrollReveal], content is only hidden client-side once it can be brought back.
 */
@Directive({
  selector: '[appStaggerReveal]',
  standalone: true,
})
export class StaggerRevealDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private intersection: IntersectionObserver | null = null;
  private mutation: MutationObserver | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const host = this.elementRef.nativeElement;
    this.intersection = new IntersectionObserver((entries) => this.reveal(entries), {
      threshold: 0.15,
    });
    this.track(Array.from(host.children) as HTMLElement[]);

    // Rows rendered from async data (@for after a fetch) gain children later.
    if (typeof MutationObserver !== 'undefined') {
      this.mutation = new MutationObserver((records) => {
        for (const record of records) {
          this.track(
            Array.from(record.addedNodes).filter(
              (node): node is HTMLElement => node instanceof HTMLElement,
            ),
          );
        }
      });
      this.mutation.observe(host, { childList: true });
    }
  }

  ngOnDestroy(): void {
    this.intersection?.disconnect();
    this.mutation?.disconnect();
  }

  private track(items: HTMLElement[]): void {
    for (const item of items) {
      if (item.classList.contains('stagger-item')) continue;
      item.classList.add('stagger-item');
      this.intersection?.observe(item);
    }
  }

  private reveal(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const item = entry.target as HTMLElement;
      item.style.transitionDelay = `${this.columnIndex(item) * STAGGER_STEP_MS}ms`;
      item.classList.add('is-visible');
      this.intersection?.unobserve(item);
    }
  }

  /** Number of earlier siblings sitting on the same visual row as `item`. */
  private columnIndex(item: HTMLElement): number {
    const top = Math.round(item.getBoundingClientRect().top);
    let index = 0;
    let sibling = item.previousElementSibling as HTMLElement | null;
    while (sibling && Math.abs(Math.round(sibling.getBoundingClientRect().top) - top) <= 4) {
      index++;
      sibling = sibling.previousElementSibling as HTMLElement | null;
    }
    return index;
  }
}
