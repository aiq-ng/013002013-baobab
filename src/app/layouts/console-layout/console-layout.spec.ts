import { Component, signal } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ConsoleLayout } from './console-layout';
import { ConsoleStore } from '../../features/console/services/console-store';
import { AdminSession } from '../../features/console/models/admin';
import { IdleTimer } from '../../features/console/services/idle-timer';
import { ToastService } from '../../shared/ui/toast/toast.service';

@Component({ selector: 'app-stub', standalone: true, template: '<h1>stub content</h1>' })
class StubComponent {}

describe('ConsoleLayout', () => {
  let signOut: ReturnType<typeof vi.fn>;
  let idle: {
    warning: ReturnType<typeof signal<boolean>>;
    secondsLeft: ReturnType<typeof signal<number>>;
    timedOut: Subject<void>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    keepAlive: ReturnType<typeof vi.fn>;
  };
  let toastError: ReturnType<typeof vi.fn<(message: string) => void>>;

  async function setup(session: AdminSession | null) {
    signOut = vi.fn().mockResolvedValue(undefined);
    toastError = vi.fn<(message: string) => void>();
    idle = {
      warning: signal(false),
      secondsLeft: signal(60),
      timedOut: new Subject<void>(),
      start: vi.fn(),
      stop: vi.fn(),
      keepAlive: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'console',
            component: ConsoleLayout,
            children: [
              { path: '', component: StubComponent },
              { path: 'programs', component: StubComponent },
              { path: 'sign-in', component: StubComponent },
            ],
          },
        ]),
        {
          provide: ConsoleStore,
          useValue: { session: signal(session).asReadonly(), signOut },
        },
        { provide: IdleTimer, useValue: idle },
      ],
    });
    vi.spyOn(TestBed.inject(ToastService), 'error').mockImplementation((message: string) =>
      toastError(message),
    );

    const harness = await RouterTestingHarness.create('/console');
    return harness;
  }

  const el = (harness: RouterTestingHarness): HTMLElement => harness.routeNativeElement!;

  it('renders the router outlet (and its routed content) when there is no session', async () => {
    const harness = await setup(null);

    expect(el(harness).textContent).toContain('stub content');
    expect(el(harness).querySelector('nav')).toBeNull();
  });

  it('renders the admin chrome and the router outlet when there is a session', async () => {
    const harness = await setup({ email: 'admin@baobab.org', role: 'admin' });

    expect(el(harness).textContent).toContain('admin@baobab.org');
    expect(el(harness).textContent).toContain('stub content');
  });

  it('uses the console accent green (design/admin) rather than the public brand green', async () => {
    const harness = await setup({ email: 'admin@baobab.org', role: 'admin' });
    const html = el(harness).innerHTML;

    expect(html).toContain('bg-console-accent');
    expect(html).not.toMatch(/brand-[67]00/);
  });

  it('offers a skip link to the main content as the first focusable element', async () => {
    const harness = await setup({ email: 'admin@baobab.org', role: 'admin' });
    const first = el(harness).querySelector('a, button') as HTMLAnchorElement;

    expect(first.textContent).toContain('Skip to main content');
    expect(first.getAttribute('href')).toBe('#console-main');
    expect(el(harness).querySelector('main#console-main[tabindex="-1"]')).toBeTruthy();

    const click = new MouseEvent('click', { cancelable: true });
    first.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe('console-main');
  });

  it('marks the current collection with aria-current="page"', async () => {
    const harness = await setup({ email: 'admin@baobab.org', role: 'admin' });
    await harness.navigateByUrl('/console/programs');

    const current = el(harness).querySelectorAll('nav a[aria-current="page"]');
    expect(current.length).toBe(1);
    expect(current[0].textContent).toContain('Programs');
  });

  it('collapses the nav behind a labelled disclosure button on small screens', async () => {
    const harness = await setup({ email: 'admin@baobab.org', role: 'admin' });
    const toggle = el(harness).querySelector('[data-testid="nav-toggle"]') as HTMLButtonElement;

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-controls')).toBe('console-nav');
    toggle.click();
    harness.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    await harness.navigateByUrl('/console/programs');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('moves focus to the main region after an in-console navigation', async () => {
    const harness = await setup({ email: 'admin@baobab.org', role: 'admin' });
    await harness.navigateByUrl('/console/programs');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.activeElement?.id).toBe('console-main');
  });

  it('starts the idle timer for a signed-in editor', async () => {
    await setup({ email: 'admin@baobab.org', role: 'admin' });
    expect(idle.start).toHaveBeenCalled();
  });

  it('warns before the idle sign-out and lets the editor stay', async () => {
    const harness = await setup({ email: 'admin@baobab.org', role: 'admin' });
    idle.warning.set(true);
    harness.detectChanges();

    const dialog = document.querySelector('[role="alertdialog"]');
    expect(dialog?.textContent).toContain('60');
    (document.querySelector('[data-testid="idle-stay"] button') as HTMLButtonElement).click();
    expect(idle.keepAlive).toHaveBeenCalled();
  });

  it('signs out, explains why, and returns to sign-in when the idle timer expires', async () => {
    const harness = await setup({ email: 'admin@baobab.org', role: 'admin' });
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');

    idle.timedOut.next();
    await harness.fixture.whenStable();

    expect(signOut).toHaveBeenCalled();
    expect(toastError).toHaveBeenCalledWith(expect.stringContaining('inactivity'));
    expect(navigate).toHaveBeenCalledWith(['/console/sign-in']);
  });

  it('still leaves the console if the sign-out request itself fails', async () => {
    const harness = await setup({ email: 'admin@baobab.org', role: 'admin' });
    signOut.mockRejectedValue(new Error('offline'));
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');

    (el(harness).querySelector('[data-testid="sign-out"]') as HTMLButtonElement).click();
    await harness.fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/console/sign-in']);
  });
});
