import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Side-panel drawer for the console's detail views (plan §8d). Same contract
 * as `app-modal` — `role="dialog"`, `aria-modal`, Escape to close — plus what
 * a modal doesn't need: a focus trap while open and focus returned to
 * whichever row opened it on close.
 */
@Component({
  selector: 'app-drawer',
  standalone: true,
  templateUrl: './drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drawer implements AfterViewInit, OnChanges {
  @Input() open = false;
  @Input({ required: true }) label = '';

  @Output() readonly closed = new EventEmitter<void>();

  @ViewChild('panel') panelRef?: ElementRef<HTMLElement>;

  private previouslyFocused: HTMLElement | null = null;

  ngAfterViewInit(): void {
    if (this.open) {
      this.captureFocus();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open) {
        this.captureFocus();
      } else {
        this.restoreFocus();
      }
    }
  }

  private captureFocus(): void {
    if (typeof document === 'undefined') return;
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    // Wait a tick for the panel to actually be in the DOM (it's behind an @if).
    setTimeout(() => this.panelRef?.nativeElement.focus(), 0);
  }

  private restoreFocus(): void {
    this.previouslyFocused?.focus();
    this.previouslyFocused = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.dismiss();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onTab(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.open || !this.panelRef) return;
    const focusable = Array.from(
      this.panelRef.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  dismiss(): void {
    this.closed.emit();
  }
}
