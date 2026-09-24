import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ConsoleStore } from '../../features/console/services/console-store';
import { IdleTimer } from '../../features/console/services/idle-timer';
import { ToastContainer } from '../../shared/ui/toast/toast-container';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { ConfirmDialogHost } from '../../shared/ui/confirm-dialog/confirm-dialog-host';
import { Modal } from '../../shared/ui/modal/modal';
import { Button } from '../../shared/ui/button/button';
import { ImageFadeInDirective } from '../../shared/directives/image-fade-in.directive';
import { environment } from '../../../environments/environment';

export type ConsoleNavIcon = 'inbox' | 'key' | 'grid' | 'document' | 'archive';

interface ConsoleNavItem {
  path: string;
  label: string;
  icon: ConsoleNavIcon;
}

const NAV_ITEMS: ConsoleNavItem[] = [
  { path: '/console/submissions', label: 'Submissions', icon: 'inbox' },
  { path: '/console/access-requests', label: 'Access Requests', icon: 'key' },
  { path: '/console/programs', label: 'Programs', icon: 'grid' },
  { path: '/console/resources', label: 'Resources', icon: 'document' },
  { path: '/console/archive', label: 'Treaties Archive', icon: 'archive' },
];

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  editor: 'Editorial Officer',
  reviewer: 'Reviewer',
};

const IDLE_WARNING_MS = 60_000;

/**
 * The console's own shell — no public header/footer, no SEO inheritance from
 * `PublicLayout` (plan §8b: console is a sibling route, not a child of it).
 * Visual language (black header, Admin badge, left COLLECTIONS sidebar) follows
 * design/admin/*.png.
 *
 * Accessibility: a skip link, `aria-current` on the active collection, a
 * disclosure-toggled nav on small screens, and focus moved to `<main>` after
 * each in-console navigation so screen-reader and keyboard users land on the
 * new page instead of back at the top of the chrome.
 *
 * Session defence: an inactivity timeout (with a warning the editor can
 * dismiss — WCAG 2.2.1) signs out an unattended console.
 */
@Component({
  selector: 'app-console-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastContainer,
    ConfirmDialogHost,
    Modal,
    Button,
    NgOptimizedImage,
    ImageFadeInDirective,
  ],
  templateUrl: './console-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleLayout {
  private readonly store = inject(ConsoleStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  readonly idle = inject(IdleTimer);

  private readonly main = viewChild<ElementRef<HTMLElement>>('main');

  readonly navItems = NAV_ITEMS;
  readonly session = this.store.session;
  readonly roleLabel = computed(() => {
    const role = this.session()?.role ?? '';
    return ROLE_LABELS[role] ?? role.charAt(0).toUpperCase() + role.slice(1);
  });
  readonly navOpen = signal(false);

  constructor() {
    effect(() => {
      if (this.session()) {
        this.idle.start({
          idleMs: environment.consoleIdleTimeoutMinutes * 60_000,
          warningMs: IDLE_WARNING_MS,
        });
      } else {
        this.idle.stop();
      }
    });

    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => this.idle.stop());

    this.idle.timedOut
      .pipe(takeUntilDestroyed())
      .subscribe(() => void this.signOut('Signed out after a period of inactivity.'));

    let firstNavigation = true;
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.navOpen.set(false);
        if (firstNavigation) {
          firstNavigation = false;
          return;
        }
        // Wait for the routed page to render before moving focus into it.
        setTimeout(() => this.main()?.nativeElement.focus({ preventScroll: true }), 0);
      });
  }

  /** `<base href="/">` would resolve a bare `#console-main` to `/#console-main` and navigate
   * away, so the skip link moves focus itself. */
  skipToMain(event: Event): void {
    event.preventDefault();
    this.main()?.nativeElement.focus();
  }

  toggleNav(): void {
    this.navOpen.update((open) => !open);
  }

  staySignedIn(): void {
    this.idle.keepAlive();
  }

  async signOut(reason?: string): Promise<void> {
    try {
      await this.store.signOut();
    } catch {
      // The local session is cleared regardless (ConsoleStore.signOut's
      // finally); leaving the console must never depend on the network.
    }
    if (reason) {
      this.toast.error(reason);
    }
    await this.router.navigate(['/console/sign-in']);
  }
}
