import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FocusReturn, initialFocusTarget, trapTab } from '../../a11y/focus';

/**
 * Generic accessible modal shell (backdrop + centered panel, `role="dialog"`,
 * Escape-to-close, backdrop-click-to-close, labelled close button). Content is
 * projected so any feature can compose its own modal body. While open, focus
 * moves inside (to `[data-autofocus]` if present), Tab is trapped, and on
 * close focus returns to whatever opened it (WAI-ARIA dialog pattern).
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input({ required: true }) label = '';
  /** `alertdialog` for confirmations that interrupt the editor's flow. */
  @Input() dialogRole: 'dialog' | 'alertdialog' = 'dialog';
  /** When set, names the dialog by an element id instead of `label`. */
  @Input() labelledBy: string | null = null;
  @Input() describedBy: string | null = null;
  /** Hides the corner close button when the content provides its own cancel. */
  @Input() showClose = true;

  @Output() readonly closed = new EventEmitter<void>();

  @ViewChild('panel') panelRef?: ElementRef<HTMLElement>;

  private readonly focusReturn = new FocusReturn();

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || typeof document === 'undefined') return;
    if (this.open) {
      this.focusReturn.capture();
      // The panel is behind an @if — wait a tick for it to be in the DOM.
      setTimeout(() => {
        const panel = this.panelRef?.nativeElement;
        if (panel) initialFocusTarget(panel).focus();
      }, 0);
    } else if (!changes['open'].firstChange) {
      this.focusReturn.restore();
    }
  }

  ngOnDestroy(): void {
    if (this.open) this.focusReturn.restore();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.open) return;
    if (event.key === 'Escape') {
      this.closed.emit();
    } else if (this.panelRef) {
      trapTab(event, this.panelRef.nativeElement);
    }
  }

  dismiss(): void {
    this.closed.emit();
  }
}
