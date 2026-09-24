import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  input,
  viewChild,
} from '@angular/core';

/**
 * Post-publish confirmation (design/admin/PROGRAMS CONFIRM.png, RESOURCES
 * SCUCCESS.png): tinted banner with check medallion, eyebrow + tag, title,
 * projected message, and projected `[actions]` below. Focus moves to the
 * heading on render so the outcome is announced, not just shown.
 */
@Component({
  selector: 'app-console-success-panel',
  standalone: true,
  templateUrl: './success-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessPanel {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly tag = input('');

  private readonly heading = viewChild.required<ElementRef<HTMLElement>>('heading');

  constructor() {
    afterNextRender(() => this.heading().nativeElement.focus());
  }
}
