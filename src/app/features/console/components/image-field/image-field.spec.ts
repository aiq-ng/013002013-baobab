import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { ImageField } from './image-field';
import { consoleValidators } from '../../validators/console-validators';

@Component({
  standalone: true,
  imports: [ImageField],
  template: `<app-console-image-field
    idPrefix="card"
    urlLabel="Image URL"
    textLabel="Alt text"
    textHint="Describes the image for screen-reader users."
    [urlControl]="url"
    [textControl]="alt"
  />`,
})
class Host {
  url = new FormControl('/images/a.jpg', {
    nonNullable: true,
    validators: [Validators.required, consoleValidators.safeLink],
  });
  alt = new FormControl('Elders in council', { nonNullable: true });
}

describe('ImageField', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renders both inputs, labelled, with the preview beside them', () => {
    const { el } = setup();
    expect(el.querySelector('label[for="card-url"]')?.textContent).toContain('Image URL');
    expect(el.querySelector('label[for="card-text"]')?.textContent).toContain('Alt text');
    expect(el.querySelector('[data-testid="image-preview"] img')?.getAttribute('src')).toBe(
      '/images/a.jpg',
    );
  });

  it('shows a placeholder instead of requesting an unsafe or empty URL', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.url.setValue('javascript:alert(1)');
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="image-preview"] img')).toBeNull();
    expect(el.querySelector('[data-testid="image-preview"]')?.textContent).toContain('No image');
  });

  it('explains when the image fails to load', () => {
    const { fixture, el } = setup();
    el.querySelector('[data-testid="image-preview"] img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="image-preview"]')?.textContent).toContain(
      "couldn't load",
    );
  });
});
