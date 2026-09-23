import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ResourcesPage } from './resources.page';
import { ConsoleStore } from '../../services/console-store';
import { SeoService } from '../../../../core/services/seo.service';
import { AdminResource } from '../../models/admin';

function makeResource(overrides: Partial<AdminResource> = {}): AdminResource {
  return {
    id: 'r1',
    title: '2025 Sovereign Partnership Protocol',
    batchReference: 'Batch 12',
    languages: 'French / English',
    fileSizeBytes: 4_404_019,
    uploadedAt: '2025-01-14T00:00:00Z',
    downloadUrl: '/files/r1.pdf',
    batchLabel: 'Annual Codex · Vol. IX',
    releaseTag: 'Permanent Archive Release',
    documentDateLabel: 'Annual Statecraft Review (2024–2025)',
    description: 'Desc',
    chapters: ['Ch. I'],
    excerptHeading: 'Excerpt',
    excerptQuote: 'Quote',
    excerptAttribution: 'Attribution',
    onlineUrl: '/doc.html',
    metadata: [
      { label: 'Label A', value: 'Value A', accent: true },
      { label: 'Label B', value: 'Value B', accent: false },
      { label: 'Label C', value: 'Value C', accent: false },
      { label: 'Label D', value: 'Value D', accent: true },
    ],
    ...overrides,
  };
}

describe('ResourcesPage', () => {
  let fixture: ComponentFixture<ResourcesPage>;
  let store: Partial<ConsoleStore>;

  beforeEach(async () => {
    const resources = [makeResource(), makeResource({ id: 'r2', downloadUrl: null })];
    store = {
      resources: signal(resources),
      resourcesLoading: signal(false),
      loadResources: vi.fn().mockResolvedValue(undefined),
      setResourcePublished: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ResourcesPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcesPage);
    fixture.detectChanges();
  });

  it('loads resources on init', () => {
    expect(store.loadResources).toHaveBeenCalled();
  });

  it('renders a row per resource', () => {
    const rows = fixture.nativeElement.querySelectorAll('[data-testid="resource-row"]');
    expect(rows.length).toBe(2);
  });

  it('calls store.setResourcePublished(id, false) when Unpublish is clicked', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '[data-testid="resource-row"] button[data-testid="unpublish-btn"]',
    );
    button.click();

    expect(store.setResourcePublished).toHaveBeenCalledWith('r1', false);
  });
});
