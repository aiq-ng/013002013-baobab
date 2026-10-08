import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ImageField } from './image-field';
import { consoleValidators } from '../../validators/console-validators';
import { ImageUploadError, ImageUploadEvent, ImageUploader } from '../../services/image-uploader';

const UPLOADED = 'https://res.cloudinary.com/demo/image/upload/v1/baobab/programs/new.jpg';

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
  let uploads: Subject<ImageUploadEvent>;
  let uploadedFiles: File[];

  function setup() {
    uploads = new Subject<ImageUploadEvent>();
    uploadedFiles = [];
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [
        {
          provide: ImageUploader,
          useValue: {
            upload: (file: File) => {
              uploadedFiles.push(file);
              return uploads;
            },
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  function choose(el: HTMLElement, file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })) {
    const input = el.querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    input.dispatchEvent(new Event('change'));
    return file;
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

  describe('uploading', () => {
    it('offers a labelled file picker limited to the accepted image types', () => {
      const { el } = setup();
      const input = el.querySelector<HTMLInputElement>('input[type="file"]')!;
      expect(input.id).toBe('card-file');
      expect(input.accept).toBe('image/jpeg,image/png,image/webp,image/avif');
      expect(el.querySelector('label[for="card-file"]')?.textContent).toContain('Upload image');
    });

    it('shows progress and blocks the form until the upload finishes, then fills in the URL', () => {
      const { fixture, el } = setup();
      const url = fixture.componentInstance.url;
      const file = choose(el);
      expect(uploadedFiles).toEqual([file]);

      uploads.next({ type: 'progress', percent: 40 });
      fixture.detectChanges();
      const bar = el.querySelector('[role="progressbar"]');
      expect(bar?.getAttribute('aria-valuenow')).toBe('40');
      expect(url.hasError('uploading')).toBe(true);

      uploads.next({ type: 'done', url: UPLOADED, width: 2400, height: 1600 });
      uploads.complete();
      fixture.detectChanges();
      expect(url.value).toBe(UPLOADED);
      expect(url.valid).toBe(true);
      expect(url.dirty).toBe(true);
      expect(el.querySelector('[role="progressbar"]')).toBeNull();
      expect(el.querySelector('[role="status"]')?.textContent).toContain('Image uploaded');
    });

    it('warns, without blocking, when the uploaded image is small for its slot', () => {
      const { fixture, el } = setup();
      choose(el);
      uploads.next({ type: 'done', url: UPLOADED, width: 640, height: 400 });
      uploads.complete();
      fixture.detectChanges();
      expect(el.querySelector('[role="status"]')?.textContent).toContain('only 640px wide');
      expect(fixture.componentInstance.url.valid).toBe(true);
    });

    it('shows the failure, keeps the previous URL, and unblocks the form', () => {
      const { fixture, el } = setup();
      choose(el);
      uploads.error(new ImageUploadError('Choose a JPEG, PNG, WebP or AVIF image.'));
      fixture.detectChanges();
      expect(el.querySelector('[role="alert"]')?.textContent).toContain('Choose a JPEG');
      expect(fixture.componentInstance.url.value).toBe('/images/a.jpg');
      expect(fixture.componentInstance.url.valid).toBe(true);
    });

    it('never shows raw error text from an unexpected failure', () => {
      const { fixture, el } = setup();
      choose(el);
      uploads.error(new Error('TypeError: internal stack'));
      fixture.detectChanges();
      expect(el.querySelector('[role="alert"]')?.textContent).toContain('upload failed');
      expect(el.textContent).not.toContain('internal stack');
    });

    it('can cancel an upload in progress', () => {
      const { fixture, el } = setup();
      choose(el);
      uploads.next({ type: 'progress', percent: 10 });
      fixture.detectChanges();
      el.querySelector<HTMLButtonElement>('[data-testid="cancel-upload"]')!.click();
      fixture.detectChanges();
      expect(uploads.observed).toBe(false);
      expect(el.querySelector('[role="progressbar"]')).toBeNull();
      expect(fixture.componentInstance.url.value).toBe('/images/a.jpg');
      expect(fixture.componentInstance.url.valid).toBe(true);
    });

    it('accepts a file dropped onto the preview', () => {
      const { el } = setup();
      const file = new File(['x'], 'drop.png', { type: 'image/png' });
      const drop = new Event('drop', { cancelable: true }) as DragEvent;
      Object.defineProperty(drop, 'dataTransfer', { value: { files: [file] } });
      el.querySelector('[data-testid="image-dropzone"]')!.dispatchEvent(drop);
      expect(uploadedFiles).toEqual([file]);
      expect(drop.defaultPrevented).toBe(true);
    });
  });
});
