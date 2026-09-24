import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { ConsoleField } from './console-field';
import { consoleValidators } from '../../validators/console-validators';

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
      hint="Shown on the public card."
      [maxLength]="5"
    />
    <app-console-field fieldId="unit" label="Unit" [control]="optionalControl" [optional]="true" />
    <app-console-field fieldId="link" label="Link" [control]="linkControl" type="url" />
  `,
})
class Host {
  control = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(5), Validators.pattern(/^\//)],
  });
  rows = 0;
  optionalControl = new FormControl('', { nonNullable: true });
  linkControl = new FormControl('javascript:alert(1)', {
    nonNullable: true,
    validators: [consoleValidators.safeLink],
  });
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
    const input = el.querySelector('#title') as HTMLInputElement;
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
    expect(el.querySelector('input#title')).toBeNull();
  });

  it('shows no error until the control is touched', () => {
    const { el } = setup();
    expect(el.querySelector('#title-error')).toBeNull();
    expect(el.querySelector('#title')?.getAttribute('aria-invalid')).toBeNull();
  });

  it('shows the required error once touched, even when touched from outside (OnPush)', () => {
    const { fixture, el, control } = setup();
    control.markAsTouched();
    fixture.detectChanges();
    expect(el.querySelector('#title-error')?.textContent).toContain('Header is required.');
    expect(el.querySelector('#title')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('links the hint and the error to the input with aria-describedby', () => {
    const { fixture, el, control } = setup();
    const input = el.querySelector('#title')!;
    expect(input.getAttribute('aria-describedby')).toBe('title-hint');
    expect(el.querySelector('#title-hint')?.textContent).toContain('Shown on the public card.');

    control.markAsTouched();
    fixture.detectChanges();
    expect(input.getAttribute('aria-describedby')).toBe('title-hint title-error');
  });

  it('marks required fields for assistive tech and labels optional ones visibly', () => {
    const { el } = setup();
    expect(el.querySelector('#title')?.getAttribute('aria-required')).toBe('true');
    expect(el.querySelector('#unit')?.getAttribute('aria-required')).toBeNull();
    expect(el.querySelector('label[for="unit"]')?.textContent).toContain('(optional)');
  });

  it('shows a character count against the limit', () => {
    const { fixture, el, control } = setup();
    control.setValue('/ab');
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="title-count"]')?.textContent?.trim()).toBe('3 / 5');
  });

  it('explains an unsafe link', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.linkControl.markAsTouched();
    fixture.detectChanges();
    expect(el.querySelector('#link')?.getAttribute('inputmode')).toBe('url');
    expect(el.querySelector('#link-error')?.textContent).toContain('https://');
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

  it('uses invalidMessage for custom validator errors', () => {
    TestBed.overrideTemplate(
      Host,
      `<app-console-field fieldId="tags" label="Tags" [control]="control" invalidMessage="At most 4 tags." />`,
    );
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.control.setValidators(() => ({ tags: true }));
    fixture.componentInstance.control.updateValueAndValidity();
    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#tags-error')?.textContent).toContain(
      'At most 4 tags.',
    );
  });
});
