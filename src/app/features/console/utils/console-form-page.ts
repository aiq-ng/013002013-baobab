import {
  Directive,
  ElementRef,
  HostListener,
  Injector,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { HasUnsavedChanges } from '../guards/unsaved-changes.guard';
import { focusFirstInvalid } from './form-focus';

/**
 * What every console editor shares, so each one gets the same guarantees:
 * - one save in flight at a time (`submitting` is a signal, so the button
 *   re-enables after a failure even under zoneless OnPush);
 * - unsaved edits are guarded against in-app navigation (`unsavedChangesGuard`)
 *   and against closing / reloading the tab (`beforeunload`);
 * - a rejected submit lands focus on the first field that needs fixing.
 */
@Directive()
export abstract class ConsoleFormPage implements HasUnsavedChanges {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly submitting = signal(false);

  /** The control tree whose dirtiness counts as "unsaved changes". */
  protected abstract get trackedForm(): AbstractControl;

  hasUnsavedChanges(): boolean {
    return this.trackedForm.dirty;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.hasUnsavedChanges()) {
      event.preventDefault();
    }
  }

  /** Surface every error and move focus to the first one. */
  protected rejectInvalid(...extra: AbstractControl[]): void {
    this.trackedForm.markAllAsTouched();
    extra.forEach((control) => control.markAsTouched());
    afterNextRender(() => focusFirstInvalid(this.host.nativeElement), {
      injector: this.injector,
    });
  }

  /** Runs `save` unless one is already running; marks the form clean on success. */
  protected async guardedSave(save: () => Promise<void>): Promise<boolean> {
    if (this.submitting()) return false;
    this.submitting.set(true);
    try {
      await save();
      this.trackedForm.markAsPristine();
      return true;
    } finally {
      this.submitting.set(false);
    }
  }
}

/** Trims every string, however deeply nested, so stray whitespace never reaches the public site. */
export function trimStrings<T>(value: T): T {
  if (typeof value === 'string') return value.trim() as T;
  if (Array.isArray(value)) return value.map((item) => trimStrings(item)) as T;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, field]) => [key, trimStrings(field)]),
    ) as T;
  }
  return value;
}
