import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';

export interface AccordionItem {
  question: string;
  answer: string;
}

/** Single-open accordion (e.g. Contact FAQ). Keyboard-operable via native <button>. */
@Component({
  selector: 'app-accordion',
  standalone: true,
  templateUrl: './accordion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accordion {
  @Input() items: AccordionItem[] = [];

  readonly openIndex = signal<number | null>(null);

  toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
