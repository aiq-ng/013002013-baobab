import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { ResourceEditPage } from './resource-edit.page';
import { ConsoleStore } from '../../../services/console-store';
import { SeoService } from '../../../../../core/services/seo.service';
import { AdminResource } from '../../../models/admin';

const CREATED_RESOURCE: AdminResource = {
  id: 'r1',
  title: '2025 Sovereign Partnership Protocol',
  batchReference: 'Batch 12',
  languages: '',
  fileSizeBytes: 1000,
  uploadedAt: '2026-01-01T00:00:00Z',
  downloadUrl: '/r1.pdf',
  batchLabel: '',
  releaseTag: '',
  documentDateLabel: '',
  description: '',
  chapters: [],
  excerptHeading: '',
  excerptQuote: '',
  excerptAttribution: '',
  onlineUrl: '',
  metadata: [],
};

describe('ResourceEditPage (new upload)', () => {
  let fixture: ComponentFixture<ResourceEditPage>;
  let store: Partial<ConsoleStore>;
  let router: Router;

  beforeEach(async () => {
    store = {
      resources: signal([]),
      loadResources: vi.fn().mockResolvedValue(undefined),
      uploadResource: vi.fn().mockResolvedValue(CREATED_RESOURCE),
      updateResourceCodexDetails: vi.fn().mockResolvedValue(undefined),
      setResourcePublished: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ResourceEditPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceEditPage);
    fixture.detectChanges();
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  async function fillRequiredFields(component: ResourceEditPage): Promise<void> {
    const file = new File(['%PDF-1.7 body'], 'doc.pdf', { type: 'application/pdf' });
    await component.setFile(file);
    component.form.controls.title.setValue('2025 Sovereign Partnership Protocol');
    component.form.controls.batchReference.setValue('Batch 12');
    component.form.controls.batchLabel.setValue('Annual Codex · Vol. IX');
    component.form.controls.releaseTag.setValue('Permanent Archive Release');
    component.form.controls.documentDateLabel.setValue('Annual Statecraft Review (2024-2025)');
    component.form.controls.description.setValue('A definitive strategic audit synthesis.');
    component.form.controls.chapters.setValue('Ch. I: One\nCh. II: Two\n\nCh. III: Three');
    component.form.controls.excerptHeading.setValue('Excerpt: Article 14.3');
    component.form.controls.excerptQuote.setValue('Where state cadastral maps diverge…');
    component.form.controls.excerptAttribution.setValue('— Dakar Secretariat Depositary');
    component.form.controls.onlineUrl.setValue('/documents/doc.html');
    component.metadataRows.at(0).patchValue({ label: 'Label A', value: 'Value A', accent: true });
    component.metadataRows.at(1).patchValue({ label: 'Label B', value: 'Value B', accent: false });
    component.metadataRows.at(2).patchValue({ label: 'Label C', value: 'Value C', accent: false });
    component.metadataRows.at(3).patchValue({ label: 'Label D', value: 'Value D', accent: true });
  }

  it('blocks submit when no file, name, or batch number are set', async () => {
    const component = fixture.componentInstance;
    await component.onSubmit();

    expect(store.uploadResource).not.toHaveBeenCalled();
    expect(component.fileError()).toBeTruthy();
    expect(component.form.controls.title.invalid).toBe(true);
    expect(component.form.controls.batchReference.invalid).toBe(true);
  });

  it('blocks submit when the selected file is not a PDF', async () => {
    const component = fixture.componentInstance;
    const file = new File(['x'], 'notes.txt', { type: 'text/plain' });
    await component.setFile(file);
    component.form.controls.title.setValue('Title');
    component.form.controls.batchReference.setValue('Batch 1');

    await component.onSubmit();

    expect(store.uploadResource).not.toHaveBeenCalled();
    expect(component.fileError()).toBeTruthy();
  });

  it('calls createResource then updateResourceCodexDetails in sequence with the right payload, then confirms', async () => {
    const component = fixture.componentInstance;
    await fillRequiredFields(component);

    await component.onSubmit();

    expect(store.uploadResource).toHaveBeenCalledWith(
      expect.any(File),
      '2025 Sovereign Partnership Protocol',
      'Batch 12',
      '',
    );
    expect(store.updateResourceCodexDetails).toHaveBeenCalledWith('r1', {
      batchLabel: 'Annual Codex · Vol. IX',
      releaseTag: 'Permanent Archive Release',
      documentDateLabel: 'Annual Statecraft Review (2024-2025)',
      description: 'A definitive strategic audit synthesis.',
      chapters: ['Ch. I: One', 'Ch. II: Two', 'Ch. III: Three'],
      excerptHeading: 'Excerpt: Article 14.3',
      excerptQuote: 'Where state cadastral maps diverge…',
      excerptAttribution: '— Dakar Secretariat Depositary',
      onlineUrl: '/documents/doc.html',
      metadata: [
        { label: 'Label A', value: 'Value A', accent: true },
        { label: 'Label B', value: 'Value B', accent: false },
        { label: 'Label C', value: 'Value C', accent: false },
        { label: 'Label D', value: 'Value D', accent: true },
      ],
    });

    const uploadOrder = (store.uploadResource as ReturnType<typeof vi.fn>).mock
      .invocationCallOrder[0];
    const codexOrder = (store.updateResourceCodexDetails as ReturnType<typeof vi.fn>).mock
      .invocationCallOrder[0];
    expect(uploadOrder).toBeLessThan(codexOrder);

    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Resource Published to Library');
    expect(el.textContent).toContain('Institutional release confirmed');
    expect(el.textContent).toContain('Batch 12');
    expect(el.querySelector('a[data-testid="preview-pdf"]')?.getAttribute('href')).toBe('/r1.pdf');
    expect(el.querySelector('a[href="/console/resources"]')?.textContent).toContain(
      'View in Resources List',
    );
  });

  it('rejects a file that claims to be a PDF but is not one', async () => {
    const component = fixture.componentInstance;
    await fillRequiredFields(component);
    await component.setFile(new File(['<html>'], 'fake.pdf', { type: 'application/pdf' }));
    await component.onSubmit();

    expect(component.fileError()).toContain('not a valid PDF');
    expect(store.uploadResource).not.toHaveBeenCalled();
  });

  it('rejects a javascript: online URL', async () => {
    const component = fixture.componentInstance;
    await fillRequiredFields(component);
    component.form.controls.onlineUrl.setValue('javascript:alert(1)');
    await component.onSubmit();

    expect(store.uploadResource).not.toHaveBeenCalled();
  });

  it('accepts a dropped file', async () => {
    const component = fixture.componentInstance;
    const file = new File(['%PDF-1.7'], 'dropped.pdf', { type: 'application/pdf' });
    await component.onDrop({
      preventDefault: () => undefined,
      dataTransfer: { files: [file] },
    } as unknown as DragEvent);

    expect(component.file()?.name).toBe('dropped.pdf');
    expect(component.fileError()).toBeNull();
  });

  it('keeps a half-created resource offline and sends the editor to finish it', async () => {
    const component = fixture.componentInstance;
    const toastError = vi.spyOn(TestBed.inject(ToastService), 'error');
    await fillRequiredFields(component);
    (store.updateResourceCodexDetails as ReturnType<typeof vi.fn>).mockRejectedValue(
      new HttpErrorResponse({ status: 500 }),
    );

    await component.onSubmit();

    expect(store.setResourcePublished).toHaveBeenCalledWith('r1', false);
    expect(toastError).toHaveBeenCalledWith(expect.stringContaining('kept unpublished'));
    expect(router.navigate).toHaveBeenCalledWith(['/console/resources', 'r1']);
  });
});

describe('ResourceEditPage (editing an existing resource)', () => {
  let fixture: ComponentFixture<ResourceEditPage>;
  let store: Partial<ConsoleStore>;
  let router: Router;

  const existing: AdminResource = {
    ...CREATED_RESOURCE,
    batchLabel: 'Annual Codex · Vol. IX',
    releaseTag: 'Permanent Archive Release',
    documentDateLabel: 'Review',
    description: 'Desc',
    chapters: ['Ch. I', 'Ch. II'],
    excerptHeading: 'Excerpt',
    excerptQuote: 'Quote',
    excerptAttribution: 'Attribution',
    onlineUrl: '/doc.html',
    metadata: [
      { label: 'A', value: '1', accent: true },
      { label: 'B', value: '2', accent: false },
      { label: 'C', value: '3', accent: false },
      { label: 'D', value: '4', accent: true },
    ],
  };

  async function setup(id: string) {
    store = {
      resources: signal([existing]),
      loadResources: vi.fn().mockResolvedValue(undefined),
      uploadResource: vi.fn(),
      updateResourceCodexDetails: vi.fn().mockResolvedValue(undefined),
    };
    await TestBed.configureTestingModule({
      imports: [ResourceEditPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => id } } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ResourceEditPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  }

  it('pre-fills the codex details and shows the document as read-only context', async () => {
    await setup('r1');
    const component = fixture.componentInstance;
    expect(component.form.controls.chapters.value).toBe('Ch. I\nCh. II');
    expect(component.metadataRows.at(3).value).toEqual({ label: 'D', value: '4', accent: true });
    expect(fixture.nativeElement.textContent).toContain('2025 Sovereign Partnership Protocol');
    expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeNull();
    expect(component.hasUnsavedChanges()).toBe(false);
  });

  it('saves only the codex details, never re-uploading', async () => {
    await setup('r1');
    const component = fixture.componentInstance;
    component.form.controls.description.setValue('Updated');
    await component.onSubmit();

    expect(store.uploadResource).not.toHaveBeenCalled();
    expect(store.updateResourceCodexDetails).toHaveBeenCalledWith(
      'r1',
      expect.objectContaining({ description: 'Updated', chapters: ['Ch. I', 'Ch. II'] }),
    );
    expect(router.navigate).toHaveBeenCalledWith(['/console/resources']);
  });

  it('says so when the resource does not exist', async () => {
    await setup('missing');
    expect(fixture.nativeElement.textContent).toContain('no longer exists');
  });
});
