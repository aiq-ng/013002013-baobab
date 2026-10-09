import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RegistryDocument } from '../../models/resource';

const SAFE_DOCUMENT_URL = /^(https?:\/\/|\/(?!\/))/i;

/**
 * One publication: batch tag, upload month, title, description, and
 * a "Preview PDF" link (new tab) and a download button that saves the file. `featured` is the larger
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
  readonly document = input.required<RegistryDocument>();
  readonly featured = input(false);

  readonly batchLabel = computed(
    () => this.document().batchLabel || this.document().batchReference,
  );

  /** Only http(s) or same-origin paths are ever linked. */
  readonly fileUrl = computed(() => {
    const url = this.document().downloadUrl;
    return url && SAFE_DOCUMENT_URL.test(url) ? url : null;
  });

  /**
   * Saves the PDF instead of displaying it. `<a download>` is ignored for
   * cross-origin files (the PDFs live on Cloudinary), so fetch it and save a
   * same-origin blob. If that fails, fall back to opening it in a new tab.
   */
  async download(event: Event, url: string): Promise<void> {
    event.preventDefault();
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${this.document().title.replace(/[\\/:*?"<>|]+/g, '-')}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl));
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}
