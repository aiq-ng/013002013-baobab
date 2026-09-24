import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SubmissionsPage } from './submissions.page';
import { ConsoleStore } from '../../services/console-store';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { AdminEngagement } from '../../models/admin';

function engagement(i: number, overrides: Partial<AdminEngagement> = {}): AdminEngagement {
  return {
    id: `e${i}`,
    referenceId: `BBG-${i}`,
    source: 'contact-form',
    name: `Person ${i}`,
    email: `p${i}@example.org`,
    message: 'Hello',
    status: 'new',
    submittedAt: '2026-03-04T09:30:00Z',
    ...overrides,
  };
}

describe('SubmissionsPage', () => {
  let fixture: ComponentFixture<SubmissionsPage>;
  let store: {
    engagements: ReturnType<typeof signal<AdminEngagement[]>>;
    engagementsTotal: ReturnType<typeof signal<number>>;
    engagementsLoading: ReturnType<typeof signal<boolean>>;
    loadEngagements: ReturnType<typeof vi.fn>;
    setEngagementStatus: ReturnType<typeof vi.fn>;
  };
  let toast: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  const el = (): HTMLElement => fixture.nativeElement;

  async function setup(total = 2, loadError: unknown = null) {
    store = {
      engagements: signal([engagement(1), engagement(2, { status: 'actioned' })]),
      engagementsTotal: signal(total),
      engagementsLoading: signal(false),
      loadEngagements: loadError
        ? vi.fn().mockRejectedValue(loadError)
        : vi.fn().mockResolvedValue(undefined),
      setEngagementStatus: vi.fn().mockResolvedValue(undefined),
    };
    toast = { success: vi.fn(), error: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [SubmissionsPage],
      providers: [
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SubmissionsPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('loads the first page on init', async () => {
    await setup();
    expect(store.loadEngagements).toHaveBeenCalledWith({ page: 1, pageSize: 25 });
    expect(el().querySelector('h1')?.textContent).toContain('Submissions');
  });

  it('shows statuses as toned badges and dates in a readable format', async () => {
    await setup();
    expect(el().querySelector('[data-tone="info"]')?.textContent).toContain('new');
    expect(el().querySelector('[data-tone="success"]')?.textContent).toContain('actioned');
    expect(el().textContent).toContain('Mar 4, 2026');
    expect(el().textContent).not.toContain('2026-03-04T09:30:00Z');
  });

  it('pages through results', async () => {
    await setup(60);
    expect(el().textContent).toContain('1–25 of 60');
    const prev = el().querySelector('[data-testid="page-prev"]') as HTMLButtonElement;
    const next = el().querySelector('[data-testid="page-next"]') as HTMLButtonElement;
    expect(prev.disabled).toBe(true);

    next.click();
    await fixture.whenStable();
    expect(store.loadEngagements).toHaveBeenLastCalledWith({ page: 2, pageSize: 25 });
  });

  it('resets to page 1 when the status filter changes', async () => {
    await setup(60);
    (el().querySelector('[data-testid="page-next"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    const spam = Array.from(el().querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Spam'),
    )!;
    spam.click();
    await fixture.whenStable();
    expect(store.loadEngagements).toHaveBeenLastCalledWith({
      status: 'spam',
      page: 1,
      pageSize: 25,
    });
  });

  it('shows a retryable error state when loading fails', async () => {
    await setup(2, new HttpErrorResponse({ status: 0 }));
    fixture.detectChanges();
    const alert = el().querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('reach the server');

    store.loadEngagements.mockResolvedValue(undefined);
    (alert!.querySelector('button') as HTMLButtonElement).click();
    expect(store.loadEngagements).toHaveBeenCalledTimes(2);
  });

  it('opens a submission from the labelled row button', async () => {
    await setup();
    const open = el().querySelector('button[aria-label="Open submission BBG-1"]') as HTMLElement;
    open.click();
    fixture.detectChanges();
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain('p1@example.org');
    expect(document.querySelector('[data-testid="submission-message"]')?.textContent).toBe('Hello');
  });

  it('frames the status filter, count, table and pagination as one list card', async () => {
    await setup(60);
    const frame = el().querySelector('[data-testid="list-frame"]')!;
    expect(frame.querySelector('[role="group"][aria-label="Filter by status"]')).toBeTruthy();
    expect(frame.querySelector('table')).toBeTruthy();
    expect(frame.querySelector('[data-testid="page-next"]')).toBeTruthy();
    expect(frame.textContent).toContain('60 submissions');
    expect(el().querySelector('h1')?.parentElement?.textContent).toContain(
      'sent from forms across the public site',
    );
  });
});
