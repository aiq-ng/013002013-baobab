import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ArchiveEditPage } from './archive-edit.page';
import { ConsoleStore } from '../../../services/console-store';
import { SeoService } from '../../../../../core/services/seo.service';
import { AdminArchiveEntry } from '../../../models/admin';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';

const entry: AdminArchiveEntry = {
  id: 'a1',
  refCode: 'REF: BBG-LQ-2023-TRX',
  regionTag: 'Sahel Central Basin',
  statusTag: 'Ratified: November 2023 · In Active Force',
  title: 'Liptako-Gourma Tri-Border Accord',
  description: 'Tripartite non-aggression corridor demarcations.',
  ratifyingParties: 'Delegations of Mali, Niger, Burkina Faso',
  workingLanguages: 'Français, Hausa, Fulfulde, Tamasheq',
  category: 'Transhumance',
  published: true,
  createdAt: '2023-11-01T00:00:00Z',
  updatedAt: '2023-11-01T00:00:00Z',
};

describe('ArchiveEditPage (editing an existing entry)', () => {
  let fixture: ComponentFixture<ArchiveEditPage>;
  let store: Partial<ConsoleStore>;
  let router: Router;

  beforeEach(async () => {
    store = {
      archiveEntries: signal([entry]),
      archiveEntriesLoading: signal(false),
      loadArchiveEntries: vi.fn().mockResolvedValue(undefined),
      updateArchiveEntry: vi.fn().mockResolvedValue(undefined),
      createArchiveEntry: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ArchiveEditPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'a1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchiveEditPage);
    fixture.detectChanges();
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('pre-populates the form from the loaded entry', () => {
    const component = fixture.componentInstance;
    expect(component.form.value.title).toBe('Liptako-Gourma Tri-Border Accord');
    expect(component.form.value.category).toBe('Transhumance');
  });

  it('blocks submit when title is empty', async () => {
    const component = fixture.componentInstance;
    component.form.controls.title.setValue('');
    await component.onSubmit();

    expect(store.updateArchiveEntry).not.toHaveBeenCalled();
    expect(component.form.controls.title.invalid).toBe(true);
  });

  it('calls store.updateArchiveEntry with id and patch, then navigates back', async () => {
    const component = fixture.componentInstance;
    component.form.controls.title.setValue('Updated Title');

    await component.onSubmit();

    expect(store.updateArchiveEntry).toHaveBeenCalledWith(
      'a1',
      expect.objectContaining({ title: 'Updated Title' }),
    );
    expect(router.navigate).toHaveBeenCalledWith(['/console/archive']);
  });
});

describe('ArchiveEditPage (creating a new entry)', () => {
  let fixture: ComponentFixture<ArchiveEditPage>;
  let store: Partial<ConsoleStore>;
  let router: Router;

  beforeEach(async () => {
    store = {
      archiveEntries: signal([]),
      archiveEntriesLoading: signal(false),
      loadArchiveEntries: vi.fn().mockResolvedValue(undefined),
      updateArchiveEntry: vi.fn().mockResolvedValue(undefined),
      createArchiveEntry: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ArchiveEditPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchiveEditPage);
    fixture.detectChanges();
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('does not call loadArchiveEntries for a new entry', () => {
    expect(store.loadArchiveEntries).not.toHaveBeenCalled();
  });

  it('blocks submit when required fields are empty', async () => {
    const component = fixture.componentInstance;
    await component.onSubmit();

    expect(store.createArchiveEntry).not.toHaveBeenCalled();
  });

  it('calls store.createArchiveEntry with the form values, then navigates back', async () => {
    const component = fixture.componentInstance;
    component.form.setValue({
      refCode: 'REF: BBG-NEW',
      regionTag: 'Region',
      statusTag: 'Ratified: 2026',
      title: 'New Accord',
      description: 'Description text.',
      ratifyingParties: 'Parties',
      workingLanguages: 'English',
      category: 'Riparian & Water',
    });

    await component.onSubmit();

    expect(store.createArchiveEntry).toHaveBeenCalledWith({
      refCode: 'REF: BBG-NEW',
      regionTag: 'Region',
      statusTag: 'Ratified: 2026',
      title: 'New Accord',
      description: 'Description text.',
      ratifyingParties: 'Parties',
      workingLanguages: 'English',
      category: 'Riparian & Water',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/console/archive']);
  });
});

describe('ArchiveEditPage (defensive behaviour)', () => {
  let fixture: ComponentFixture<ArchiveEditPage>;
  let store: Partial<ConsoleStore> & { updateArchiveEntry: ReturnType<typeof vi.fn> };
  let toastError: ReturnType<typeof vi.spyOn>;

  async function setup(id: string | null = 'a1') {
    store = {
      archiveEntries: signal([entry]),
      archiveEntriesLoading: signal(false),
      loadArchiveEntries: vi.fn().mockResolvedValue(undefined),
      updateArchiveEntry: vi.fn().mockResolvedValue(undefined),
      createArchiveEntry: vi.fn().mockResolvedValue(undefined),
    };
    await TestBed.configureTestingModule({
      imports: [ArchiveEditPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => id } } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ArchiveEditPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    toastError = vi.spyOn(TestBed.inject(ToastService), 'error');
  }

  it('treats whitespace-only text as missing', async () => {
    await setup();
    fixture.componentInstance.form.controls.title.setValue('    ');
    await fixture.componentInstance.onSubmit();
    expect(store.updateArchiveEntry).not.toHaveBeenCalled();
  });

  it('trims surrounding whitespace before saving', async () => {
    await setup();
    fixture.componentInstance.form.controls.title.setValue('  Trimmed  ');
    await fixture.componentInstance.onSubmit();
    expect(store.updateArchiveEntry).toHaveBeenCalledWith(
      'a1',
      expect.objectContaining({ title: 'Trimmed' }),
    );
  });

  it('ignores a second submit while the first is in flight', async () => {
    await setup();
    store.updateArchiveEntry.mockReturnValue(new Promise(() => undefined));
    void fixture.componentInstance.onSubmit();
    void fixture.componentInstance.onSubmit();
    expect(store.updateArchiveEntry).toHaveBeenCalledTimes(1);
  });

  it('re-enables saving and explains why after a failed save', async () => {
    await setup();
    store.updateArchiveEntry.mockRejectedValue(new HttpErrorResponse({ status: 0 }));
    await fixture.componentInstance.onSubmit();
    fixture.detectChanges();

    expect(fixture.componentInstance.submitting()).toBe(false);
    expect(toastError).toHaveBeenCalledWith(expect.stringContaining('reach the server'));
    const submit = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    expect(submit.disabled).toBe(false);
  });

  it('reports unsaved changes only after an edit, and not once saved', async () => {
    await setup();
    const page = fixture.componentInstance;
    expect(page.hasUnsavedChanges()).toBe(false);

    page.form.controls.title.setValue('Changed');
    page.form.markAsDirty();
    expect(page.hasUnsavedChanges()).toBe(true);

    await page.onSubmit();
    expect(page.hasUnsavedChanges()).toBe(false);
  });

  it('says so when the entry does not exist', async () => {
    await setup('missing');
    expect(fixture.nativeElement.textContent).toContain('no longer exists');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
  });
});
