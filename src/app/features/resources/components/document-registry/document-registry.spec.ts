import { TestBed } from '@angular/core/testing';
import { DocumentRegistry } from './document-registry';
import { RegistryDocument } from '../../models/resource';

const makeDocument = (overrides: Partial<RegistryDocument> = {}): RegistryDocument => ({
  id: 'doc-1',
  title: 'Sahel Transhumance Codices & Treaty Summary',
  batchReference: 'Batch 11',
  languages: 'Fulfulde / Arabic / French',
  fileSizeBytes: 9123430,
  downloadUrl: '/documents/resources/sahel-transhumance-codices-treaty-summary.pdf',
  batchLabel: 'Batch 11',
  releaseTag: 'Summary Digest',
  documentDateLabel: '2 December 2024',
  description: 'A consolidated summary.',
  chapters: [],
  excerptHeading: '',
  excerptQuote: '',
  excerptAttribution: '',
  onlineUrl: '',
  metadata: [],
  ...overrides,
});

describe('DocumentRegistry', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DocumentRegistry],
    });
  });

  it('renders nothing when there are no documents', () => {
    const fixture = TestBed.createComponent(DocumentRegistry);
    fixture.componentInstance.documents = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('section')).toBeNull();
  });

  it('renders each document with its batch reference, title, size, and languages', () => {
    const fixture = TestBed.createComponent(DocumentRegistry);
    fixture.componentInstance.documents = [makeDocument()];
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Published Registry Documents');
    expect(text).toContain('Batch 11');
    expect(text).toContain('Sahel Transhumance Codices & Treaty Summary');
    expect(text).toContain('8.7 MB');
    expect(text).toContain('Fulfulde / Arabic / French');
  });

  it('only renders a download link when downloadUrl is present', () => {
    const fixture = TestBed.createComponent(DocumentRegistry);
    fixture.componentInstance.documents = [
      makeDocument({ id: 'doc-1', downloadUrl: '/documents/resources/doc-1.pdf' }),
      makeDocument({ id: 'doc-2', title: 'Undownloadable Document', downloadUrl: null }),
    ];
    fixture.detectChanges();

    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/documents/resources/doc-1.pdf');
  });
});
