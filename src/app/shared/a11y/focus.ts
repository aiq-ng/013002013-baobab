export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Where focus lands when a dialog opens: the element (or first focusable
 * element inside the host) marked `data-autofocus`, else the dialog panel
 * itself. Destructive confirmations mark their safe choice, so a reflexive
 * Enter never deletes anything.
 */
export function initialFocusTarget(container: HTMLElement): HTMLElement {
  const marked = container.querySelector<HTMLElement>('[data-autofocus]');
  if (!marked) return container;
  return marked.matches(FOCUSABLE_SELECTOR)
    ? marked
    : (marked.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? container);
}

/** Keeps Tab / Shift+Tab cycling inside `container` (modal focus trap). */
export function trapTab(event: KeyboardEvent, container: HTMLElement): void {
  if (event.key !== 'Tab') return;
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && (active === first || active === container)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

/** Remembers what had focus before a dialog opened so it can be given back. */
export class FocusReturn {
  private previous: HTMLElement | null = null;

  capture(): void {
    if (typeof document === 'undefined') return;
    this.previous = document.activeElement as HTMLElement | null;
  }

  restore(): void {
    const previous = this.previous;
    this.previous = null;
    if (previous?.isConnected) previous.focus();
  }
}
