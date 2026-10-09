import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { ResourceEditPage } from './resource-edit.page';
import { ConsoleStore } from '../../../services/console-store';
import { SeoService } from '../../../../../core/services/seo.service';
import { AdminResource } from '../../../models/admin';
import { PdfUploadError } from '../../../services/pdf-uploader';

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

  it('collects only the PDF, name and batch ID, matching the design', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Drop PDF here or click to browse');
    expect(el.querySelector('#title')).toBeTruthy();
    expect(el.querySelector('label[for="batchReference"]')?.textContent).toContain('Batch ID');
    expect(el.querySelector('#batchLabel')).toBeNull();
    expect(el.querySelector('#excerptHeading')).toBeNull();
    expect(el.querySelector('[formArrayName="metadataRows"]')).toBeNull();
    expect(el.querySelector('button[type="submit"]')?.textContent).toContain('Publish Resource');
  });

  it('publishes with just the PDF, name and batch ID, then confirms', async () => {
    const component = fixture.componentInstance;
    await fillRequiredFields(component);

    await component.onSubmit();

    expect(store.uploadResource).toHaveBeenCalledWith(
      expect.any(File),
      '2025 Sovereign Partnership Protocol',
      'Batch 12',
      '',
      expect.any(Function),
    );
    expect(store.updateResourceCodexDetails).not.toHaveBeenCalled();

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

  it('shows upload progress while the PDF is sending', async () => {
    const component = fixture.componentInstance;
    await fillRequiredFields(component);
    (store.uploadResource as ReturnType<typeof vi.fn>).mockImplementation(
      async (...args: unknown[]) => {
        (args[4] as (percent: number) => void)(42);
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Uploading PDF… 42%');
        return CREATED_RESOURCE;
      },
    );

    await component.onSubmit();

    expect(component.uploadPercent()).toBeNull();
  });

  it("shows the uploader's own message when the PDF upload fails", async () => {
    const component = fixture.componentInstance;
    const toast = TestBed.inject(ToastService);
    const errorSpy = vi.spyOn(toast, 'error');
    await fillRequiredFields(component);
    (store.uploadResource as ReturnType<typeof vi.fn>).mockRejectedValue(
      new PdfUploadError("PDF uploads aren't set up yet on this server."),
    );

    await component.onSubmit();

    expect(errorSpy).toHaveBeenCalledWith("PDF uploads aren't set up yet on this server.");
    expect(store.updateResourceCodexDetails).not.toHaveBeenCalled();
  });

  it('rejects a file that claims to be a PDF but is not one', async () => {
    const component = fixture.componentInstance;
    await fillRequiredFields(component);
    await component.setFile(new File(['<html>'], 'fake.pdf', { type: 'application/pdf' }));
    await component.onSubmit();

    expect(component.fileError()).toContain('not a valid PDF');
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
});

describe('ResourceEditPage (editing an existing resource)', () => {
  let fixture: ComponentFixture<ResourceEditPage>;
  let store: Partial<ConsoleStore>;
  let router: Router;

  const existing: AdminResource = { ...CREATED_RESOURCE, fileSizeBytes: 2 * 1024 * 1024 };

  async function setup(id: string) {
    store = {
      resources: signal([existing]),
      loadResources: vi.fn().mockResolvedValue(undefined),
      uploadResource: vi.fn(),
      updateResource: vi.fn().mockResolvedValue(existing),
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

  it('shows the same three fields as the upload form, pre-filled', async () => {
    await setup('r1');
    const component = fixture.componentInstance;
    const el: HTMLElement = fixture.nativeElement;

    expect(component.form.getRawValue()).toEqual({
      title: '2025 Sovereign Partnership Protocol',
      batchReference: 'Batch 12',
    });
    expect(el.querySelector('input[type="file"]')).toBeTruthy();
    expect(el.textContent).toContain('Current file: PDF · 2.0 MB');
    expect(el.querySelector('label[for="batchReference"]')?.textContent).toContain('Batch ID');
    expect(el.querySelector('#excerptHeading')).toBeNull();
    expect(component.hasUnsavedChanges()).toBe(false);
  });

  it('saves a new name and batch ID without re-uploading the PDF', async () => {
    await setup('r1');
    const component = fixture.componentInstance;
    component.form.controls.title.setValue('Renamed');
    component.form.controls.batchReference.setValue('Batch 13');

    await component.onSubmit();

    expect(store.updateResource).toHaveBeenCalledWith(
      'r1',
      null,
      'Renamed',
      'Batch 13',
      expect.any(Function),
    );
    expect(router.navigate).toHaveBeenCalledWith(['/console/resources']);
  });

  it('replaces the PDF when a new one is chosen', async () => {
    await setup('r1');
    const component = fixture.componentInstance;
    const file = new File(['%PDF-1.7 v2'], 'v2.pdf', { type: 'application/pdf' });
    await component.setFile(file);

    await component.onSubmit();

    expect(store.updateResource).toHaveBeenCalledWith(
      'r1',
      file,
      '2025 Sovereign Partnership Protocol',
      'Batch 12',
      expect.any(Function),
    );
  });

  it('says so when the resource does not exist', async () => {
    await setup('missing');
    expect(fixture.nativeElement.textContent).toContain('no longer exists');
  });
});
