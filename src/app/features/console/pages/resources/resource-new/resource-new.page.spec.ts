import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ResourceNewPage } from './resource-new.page';
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

describe('ResourceNewPage', () => {
  let fixture: ComponentFixture<ResourceNewPage>;
  let store: Partial<ConsoleStore>;
  let router: Router;

  beforeEach(async () => {
    store = {
      uploadResource: vi.fn().mockResolvedValue(CREATED_RESOURCE),
      updateResourceCodexDetails: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ResourceNewPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceNewPage);
    fixture.detectChanges();
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  function fillRequiredFields(component: ResourceNewPage): void {
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    component.setFile(file);
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
    component.setFile(file);
    component.form.controls.title.setValue('Title');
    component.form.controls.batchReference.setValue('Batch 1');

    await component.onSubmit();

    expect(store.uploadResource).not.toHaveBeenCalled();
    expect(component.fileError()).toBeTruthy();
  });

  it('calls createResource then updateResourceCodexDetails in sequence with the right payload, then navigates back', async () => {
    const component = fixture.componentInstance;
    fillRequiredFields(component);

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

    expect(router.navigate).toHaveBeenCalledWith(['/console/resources']);
  });
});
