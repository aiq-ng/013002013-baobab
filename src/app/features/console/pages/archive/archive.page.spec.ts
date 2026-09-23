import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ArchivePage } from './archive.page';
import { ConsoleStore } from '../../services/console-store';
import { SeoService } from '../../../../core/services/seo.service';
import { AdminArchiveEntry } from '../../models/admin';

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

  beforeEach(async () => {
    const entries = [makeEntry(), makeEntry({ id: 'a2', published: false })];
    store = {
      archiveEntries: signal(entries),
      archiveEntriesLoading: signal(false),
      loadArchiveEntries: vi.fn().mockResolvedValue(undefined),
      setArchiveEntryPublished: vi.fn().mockResolvedValue(undefined),
      deleteArchiveEntry: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ArchivePage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
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

  it('calls store.setArchiveEntryPublished(id, false) when Unpublish is clicked', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="archive-row"] button[data-testid="unpublish-btn"]',
    );
    button.click();

    expect(store.setArchiveEntryPublished).toHaveBeenCalledWith('a1', false);
  });

  it('calls store.deleteArchiveEntry(id) when Delete is clicked', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="archive-row"] button[data-testid="delete-btn"]',
    );
    button.click();

    expect(store.deleteArchiveEntry).toHaveBeenCalledWith('a1');
  });
});
