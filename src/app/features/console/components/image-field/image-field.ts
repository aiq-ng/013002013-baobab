import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subscription, finalize } from 'rxjs';
import { ConsoleField } from '../console-field/console-field';
import { ImageUploadError, ImageUploader } from '../../services/image-uploader';

/** Held on the URL control while an upload runs, so the form can't be saved mid-upload. */
const UPLOADING: ValidatorFn = (): ValidationErrors => ({ uploading: true });

/** Below this width an image looks soft in the site's widest image slots. */
const RECOMMENDED_MIN_WIDTH = 1200;

export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/avif';

/**
 * An image URL plus its companion text (alt text or caption), with a 16:9
 * preview beside them. The preview only requests URLs that pass validation
 * (never `javascript:`/`data:`), and shows an explicit placeholder when
 * there's nothing to show or the image fails to load — so a broken path is
 * caught here, not on the public site.
 *
 * Editors can upload a file (picker or drag-and-drop onto the preview); the
 * uploaded image's Cloudinary URL fills the URL field. Typing a URL still
 * works, so existing site images keep their paths untouched.
 */
@Component({
  selector: 'app-console-image-field',
  standalone: true,
  imports: [ConsoleField],
  templateUrl: './image-field.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ImageField implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly uploader = inject(ImageUploader);

  @Input({ required: true }) idPrefix = '';
  @Input({ required: true }) urlControl!: FormControl<string>;
  @Input({ required: true }) textControl!: FormControl<string>;
  @Input() urlLabel = 'Image URL';
  @Input() urlHint =
    'Upload an image, or enter a site path such as /images/… or an https:// address.';
  @Input() textLabel = 'Alt text';
  @Input() textHint = '';
  @Input() textMaxLength: number | null = null;

  readonly acceptedTypes = ACCEPTED_IMAGE_TYPES;
  readonly failed = signal(false);
  /** Upload progress 0–100, or null when no upload is running. */
  readonly progress = signal<number | null>(null);
  readonly uploadError = signal<string | null>(null);
  readonly uploadNotice = signal<string | null>(null);
  readonly dragging = signal(false);

  private lastUrl = '';
  private upload: Subscription | null = null;

  ngOnInit(): void {
    this.lastUrl = this.urlControl.value;
    this.urlControl.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.urlControl.value !== this.lastUrl) {
        this.lastUrl = this.urlControl.value;
        this.failed.set(false);
      }
      this.cdr.markForCheck();
    });
    this.destroyRef.onDestroy(() => this.cancelUpload());
  }

  get previewUrl(): string | null {
    return this.urlControl.valid && this.urlControl.value ? this.urlControl.value : null;
  }

  get uploading(): boolean {
    return this.progress() !== null;
  }

  onFileChosen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // Reset so choosing the same file again (e.g. after a failure) still fires `change`.
    input.value = '';
    if (file) this.start(file);
  }

  onDragOver(event: DragEvent): void {
    if (this.urlControl.disabled || this.uploading) return;
    event.preventDefault();
    this.dragging.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file && !this.urlControl.disabled && !this.uploading) this.start(file);
  }

  cancelUpload(): void {
    if (!this.upload) return;
    this.upload.unsubscribe();
    this.upload = null;
    this.uploadNotice.set('Upload cancelled.');
  }

  private start(file: File): void {
    this.cancelUpload();
    this.uploadError.set(null);
    this.uploadNotice.set(null);
    this.progress.set(0);
    this.urlControl.addValidators(UPLOADING);
    this.urlControl.updateValueAndValidity();

    this.upload = this.uploader
      .upload(file)
      .pipe(
        finalize(() => {
          this.upload = null;
          this.progress.set(null);
          this.urlControl.removeValidators(UPLOADING);
          this.urlControl.updateValueAndValidity();
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (event) => {
          if (event.type === 'progress') {
            this.progress.set(event.percent);
            return;
          }
          this.urlControl.removeValidators(UPLOADING);
          this.urlControl.setValue(event.url);
          this.urlControl.markAsDirty();
          this.urlControl.markAsTouched();
          this.uploadNotice.set(
            event.width < RECOMMENDED_MIN_WIDTH
              ? `Image uploaded, but it's only ${event.width}px wide and may look soft on large screens. ${RECOMMENDED_MIN_WIDTH}px or wider is recommended.`
              : 'Image uploaded. Save the program to publish it.',
          );
        },
        error: (error: unknown) => {
          this.uploadError.set(
            error instanceof ImageUploadError
              ? error.message
              : 'The upload failed. Please try again.',
          );
          this.cdr.markForCheck();
        },
      });
  }
}
