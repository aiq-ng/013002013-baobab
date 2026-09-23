import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ConsoleStore } from '../../features/console/services/console-store';
import { ToastContainer } from '../../shared/ui/toast/toast-container';
import { ImageFadeInDirective } from '../../shared/directives/image-fade-in.directive';

/**
 * The console's own shell — no public header/footer, no SEO inheritance from
 * `PublicLayout` (plan §8b: console is a sibling route, not a child of it).
 * Visual language (dark header, Admin badge, left COLLECTIONS sidebar) follows
 * design/admin/*.png.
 */
@Component({
  selector: 'app-console-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastContainer,
    NgOptimizedImage,
    ImageFadeInDirective,
  ],
  templateUrl: './console-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleLayout {
  private readonly store = inject(ConsoleStore);
  private readonly router = inject(Router);

  readonly session = this.store.session;

  async signOut(): Promise<void> {
    await this.store.signOut();
    await this.router.navigate(['/console/sign-in']);
  }
}
