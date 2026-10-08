import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RegistryDocument } from '../../models/resource';

const SAFE_DOCUMENT_URL = /^(https?:\/\/|\/(?!\/))/i;

/**
 * One publication: batch tag, upload month, title, description, an inline
 * "Preview PDF" disclosure, and a download link. `featured` is the larger
 * card at the top of the page; otherwise it's a row in "All publications".
 */
@Component({
  selector: 'app-publication-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './publication-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationCard {
  private readonly sanitizer = inject(DomSanitizer);

  readonly document = input.required<RegistryDocument>();
  readonly featured = input(false);

  readonly previewOpen = signal(false);

  readonly batchLabel = computed(
    () => this.document().batchLabel || this.document().batchReference,
  );

  /** Only http(s) or same-origin paths are ever linked or embedded. */
  readonly fileUrl = computed(() => {
    const url = this.document().downloadUrl;
    return url && SAFE_DOCUMENT_URL.test(url) ? url : null;
  });

  readonly previewSrc = computed<SafeResourceUrl | null>(() => {
    const url = this.fileUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  readonly previewId = computed(() => `publication-preview-${this.document().id}`);

  togglePreview(): void {
    this.previewOpen.update((open) => !open);
  }
}
