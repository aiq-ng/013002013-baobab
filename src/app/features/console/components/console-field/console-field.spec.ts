import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { ConsoleField } from './console-field';

@Component({
  standalone: true,
  imports: [ConsoleField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-console-field
      fieldId="title"
      label="Header"
      [control]="control"
      [rows]="rows"
      placeholder="e.g. Corridor"
      patternMessage="Must be a path."
    />
  `,
})
class Host {
  control = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(5), Validators.pattern(/^\//)],
  });
  rows = 0;
}

describe('ConsoleField', () => {
  function setup(rows = 0) {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.rows = rows;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    return { fixture, el, control: fixture.componentInstance.control };
  }

  it('renders a labelled text input bound to the control', () => {
    const { el, control } = setup();
    const input = el.querySelector('input') as HTMLInputElement;
    expect(el.querySelector('label')?.getAttribute('for')).toBe('title');
    expect(input.id).toBe('title');
    expect(input.placeholder).toBe('e.g. Corridor');

    input.value = '/abc';
    input.dispatchEvent(new Event('input'));
    expect(control.value).toBe('/abc');
  });

  it('renders a textarea when rows is set', () => {
    const { el } = setup(4);
    expect(el.querySelector('textarea')?.getAttribute('rows')).toBe('4');
    expect(el.querySelector('input')).toBeNull();
  });

  it('shows no error until the control is touched', () => {
    const { el } = setup();
    expect(el.querySelector('[role="alert"]')).toBeNull();
  });

  it('shows the required error once touched, even when touched from outside (OnPush)', () => {
    const { fixture, el, control } = setup();
    control.markAsTouched();
    fixture.detectChanges();
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Header is required.');
    expect(el.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('explains a length error with the limit', () => {
    const { fixture, el, control } = setup();
    control.setValue('/toolong');
    control.markAsTouched();
    fixture.detectChanges();
    expect(el.textContent).toContain('Header must be 5 characters or fewer.');
  });

  it('uses the supplied pattern message', () => {
    const { fixture, el, control } = setup();
    control.setValue('abc');
    control.markAsTouched();
    fixture.detectChanges();
    expect(el.textContent).toContain('Must be a path.');
  });
});
