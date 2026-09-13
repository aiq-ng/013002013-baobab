import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

/**
 * Generic accessible modal shell (backdrop + centered panel, `role="dialog"`,
 * Escape-to-close, backdrop-click-to-close, labelled close button). Content is
 * projected so any feature can compose its own modal body.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  @Input() open = false;
  @Input({ required: true }) label = '';

  @Output() readonly closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.closed.emit();
    }
  }

  dismiss(): void {
    this.closed.emit();
  }
}
