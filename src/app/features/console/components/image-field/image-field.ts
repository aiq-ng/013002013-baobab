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
import { FormControl } from '@angular/forms';
import { ConsoleField } from '../console-field/console-field';

/**
 * An image URL plus its companion text (alt text or caption), with a 16:9
 * preview beside them. The preview only requests URLs that pass validation
 * (never `javascript:`/`data:`), and shows an explicit placeholder when
 * there's nothing to show or the image fails to load — so a broken path is
 * caught here, not on the public site.
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

  @Input({ required: true }) idPrefix = '';
  @Input({ required: true }) urlControl!: FormControl<string>;
  @Input({ required: true }) textControl!: FormControl<string>;
  @Input() urlLabel = 'Image URL';
  @Input() urlHint = 'A site path such as /images/… or an https:// address.';
  @Input() textLabel = 'Alt text';
  @Input() textHint = '';
  @Input() textMaxLength: number | null = null;

  readonly failed = signal(false);
  private lastUrl = '';

  ngOnInit(): void {
    this.lastUrl = this.urlControl.value;
    this.urlControl.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.urlControl.value !== this.lastUrl) {
        this.lastUrl = this.urlControl.value;
        this.failed.set(false);
      }
      this.cdr.markForCheck();
    });
  }

  get previewUrl(): string | null {
    return this.urlControl.valid && this.urlControl.value ? this.urlControl.value : null;
  }
}
