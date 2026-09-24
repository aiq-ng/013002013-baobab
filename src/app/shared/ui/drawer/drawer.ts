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
import { FocusReturn, trapTab } from '../../a11y/focus';

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

  private readonly focusReturn = new FocusReturn();

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
    this.focusReturn.capture();
    // Wait a tick for the panel to actually be in the DOM (it's behind an @if).
    setTimeout(() => this.panelRef?.nativeElement.focus(), 0);
  }

  private restoreFocus(): void {
    this.focusReturn.restore();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.dismiss();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onTab(event: KeyboardEvent): void {
    if (this.open && this.panelRef) {
      trapTab(event, this.panelRef.nativeElement);
    }
  }

  dismiss(): void {
    this.closed.emit();
  }
}
