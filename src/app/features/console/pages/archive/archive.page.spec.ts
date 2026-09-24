import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ArchivePage } from './archive.page';
import { ConsoleStore } from '../../services/console-store';
import { SeoService } from '../../../../core/services/seo.service';
import { AdminArchiveEntry } from '../../models/admin';
import { ConfirmService } from '../../../../shared/ui/confirm-dialog/confirm.service';

function makeEntry(overrides: Partial<AdminArchiveEntry> = {}): AdminArchiveEntry {
  return {
    id: 'a1',
    refCode: 'REF: BBG-LQ-2023-TRX',
    regionTag: 'Sahel Central Basin',
    statusTag: 'Ratified: November 2023 · In Active Force',
    title: 'Liptako-Gourma Tri-Border Accord & Customary Grazing Charter',
    description: 'Tripartite non-aggression corridor demarcations.',
    ratifyingParties: 'Delegations of Mali, Niger, Burkina Faso',
    workingLanguages: 'Français, Hausa, Fulfulde, Tamasheq',
    category: 'Transhumance',
    published: true,
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2023-11-01T00:00:00Z',
    ...overrides,
  };
}

describe('ArchivePage', () => {
  let fixture: ComponentFixture<ArchivePage>;
  let store: Partial<ConsoleStore>;
  let confirm: { ask: ReturnType<typeof vi.fn> };
  const el = (): HTMLElement => fixture.nativeElement;

  beforeEach(async () => {
    const entries = [makeEntry(), makeEntry({ id: 'a2', published: false })];
    store = {
      archiveEntries: signal(entries),
      archiveEntriesLoading: signal(false),
      loadArchiveEntries: vi.fn().mockResolvedValue(undefined),
      setArchiveEntryPublished: vi.fn().mockResolvedValue(undefined),
      deleteArchiveEntry: vi.fn().mockResolvedValue(undefined),
    };

    confirm = { ask: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [ArchivePage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        { provide: ConfirmService, useValue: confirm },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivePage);
    fixture.detectChanges();
  });

  it('loads archive entries on init', () => {
    expect(store.loadArchiveEntries).toHaveBeenCalled();
  });

  it('renders a row per entry', () => {
    const rows = fixture.nativeElement.querySelectorAll('[data-testid="archive-row"]');
    expect(rows.length).toBe(2);
  });

  it('confirms, then unpublishes', async () => {
    (el().querySelector('button[data-testid="unpublish-btn"]') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(confirm.ask).toHaveBeenCalled();
    expect(store.setArchiveEntryPublished).toHaveBeenCalledWith('a1', false);
  });

  it('requires a danger confirmation before deleting', async () => {
    (el().querySelector('button[data-testid="delete-btn"]') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(confirm.ask).toHaveBeenCalledWith(expect.objectContaining({ tone: 'danger' }));
    expect(store.deleteArchiveEntry).toHaveBeenCalledWith('a1');
  });

  it('deletes nothing when the editor cancels', async () => {
    confirm.ask.mockResolvedValue(false);
    (el().querySelector('button[data-testid="delete-btn"]') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(store.deleteArchiveEntry).not.toHaveBeenCalled();
  });

  it('shows draft entries as such', () => {
    const rows = el().querySelectorAll('[data-testid="archive-row"]');
    expect(rows[1].querySelector('.tone-badge')?.textContent).toContain('Draft');
  });
});
