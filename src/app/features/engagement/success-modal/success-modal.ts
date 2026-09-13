import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from '../../../shared/ui/modal/modal';
import { SuccessModalService } from '../services/success-modal.service';
import { confirmationCopyFor } from '../confirmation-copy';

/**
 * Shared success confirmation, shown as a modal over the current page for all
 * 6 email-capture entry points across the site — no navigation away from the
 * form, per the `PARTNERSHIPS 2` design export. Mounted once in `PublicLayout`.
 */
@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [Modal],
  templateUrl: './success-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessModal {
  private readonly successModalService = inject(SuccessModalService);
  private readonly router = inject(Router);

  readonly currentYear = new Date().getFullYear();
  readonly submission = this.successModalService.current;

  readonly copy = computed(() => confirmationCopyFor(this.submission()?.source));

  close(): void {
    this.successModalService.close();
  }

  returnHome(): void {
    this.successModalService.close();
    this.router.navigate(['/']);
  }
}
