import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AccessRequestsPage } from './access-requests.page';
import { ConsoleStore } from '../../services/console-store';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { AdminAccessRequest } from '../../models/admin';

const REQUEST: AdminAccessRequest = {
  id: 'a1',
  submissionId: 's1',
  referenceId: 'ACC-1',
  name: 'Envoy',
  email: 'envoy@example.org',
  delegationToken: 'TOKEN-XYZ',
  institution: 'Ministry',
  state: 'pending',
  createdAt: '2026-03-04T09:30:00Z',
};

describe('AccessRequestsPage', () => {
  let fixture: ComponentFixture<AccessRequestsPage>;
  let store: {
    accessRequests: ReturnType<typeof signal<AdminAccessRequest[]>>;
    accessRequestsLoading: ReturnType<typeof signal<boolean>>;
    loadAccessRequests: ReturnType<typeof vi.fn>;
    decideAccessRequest: ReturnType<typeof vi.fn>;
  };
  let toast: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  const el = (): HTMLElement => fixture.nativeElement;

  beforeEach(async () => {
    store = {
      accessRequests: signal([REQUEST]),
      accessRequestsLoading: signal(false),
      loadAccessRequests: vi.fn().mockResolvedValue(undefined),
      decideAccessRequest: vi.fn().mockResolvedValue(undefined),
    };
    toast = { success: vi.fn(), error: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [AccessRequestsPage],
      providers: [
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AccessRequestsPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  function openRequest(): HTMLElement {
    (el().querySelector('button[aria-label="Review request ACC-1"]') as HTMLElement).click();
    fixture.detectChanges();
    return document.querySelector('[role="dialog"]') as HTMLElement;
  }

  const button = (panel: HTMLElement, label: string): HTMLButtonElement =>
    Array.from(panel.querySelectorAll('button')).find((b) => b.textContent?.includes(label))!;

  it('lists pending requests with readable dates', () => {
    expect(el().querySelector('h1')?.textContent).toContain('Access requests');
    expect(el().textContent).toContain('Mar 4, 2026');
  });

  it('records an approval with the note and the state it was reviewed in', async () => {
    const panel = openRequest();
    const note = panel.querySelector('textarea') as HTMLTextAreaElement;
    note.value = 'Verified by phone';
    note.dispatchEvent(new Event('input'));
    button(panel, 'Approve').click();
    await fixture.whenStable();

    expect(store.decideAccessRequest).toHaveBeenCalledWith('a1', {
      approve: true,
      note: 'Verified by phone',
      expectedState: 'pending',
    });
    expect(toast.success).toHaveBeenCalledWith('Access approved.');
  });

  it('locks both decision buttons while a decision is being recorded', async () => {
    store.decideAccessRequest.mockReturnValue(new Promise(() => undefined));
    const panel = openRequest();
    button(panel, 'Approve').click();
    fixture.detectChanges();

    expect(button(panel, 'Approv').disabled).toBe(true);
    expect(button(panel, 'Deny').disabled).toBe(true);
  });

  it('explains a race with another reviewer and reloads', async () => {
    store.decideAccessRequest.mockRejectedValue(new HttpErrorResponse({ status: 409 }));
    const panel = openRequest();
    button(panel, 'Deny').click();
    await fixture.whenStable();

    expect(toast.error).toHaveBeenCalledWith('Someone else already decided this request.');
    expect(store.loadAccessRequests).toHaveBeenCalledTimes(2);
  });
});
