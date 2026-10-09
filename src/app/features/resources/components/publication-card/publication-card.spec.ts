import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicationCard } from './publication-card';
import { createRegistryDocument } from '../../testing/resource-fixture';
import { RegistryDocument } from '../../models/resource';

describe('PublicationCard', () => {
  let fixture: ComponentFixture<PublicationCard>;

  function render(document: RegistryDocument, featured = false): HTMLElement {
    fixture = TestBed.createComponent(PublicationCard);
    fixture.componentRef.setInput('document', document);
    fixture.componentRef.setInput('featured', featured);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PublicationCard] });
  });

  it('renders the batch tag, upload month, title, and description', () => {
    const el = render(createRegistryDocument());
    expect(el.textContent).toContain('Batch 01');
    expect(el.textContent).toContain('Uploaded: October 2026');
    expect(el.textContent).toContain('Policy Advisory & Regional Harmonization');
    expect(el.textContent).toContain('Transforming local successes into regional policy guidance');
  });

  it('falls back to the batch reference when no batch label is set', () => {
    const el = render(createRegistryDocument({ batchLabel: '' }));
    expect(el.textContent).toContain('BBG-2026-001');
  });

  it('renders the title as an h2 when featured and an h3 in the list', () => {
    expect(render(createRegistryDocument(), true).querySelector('h2')).toBeTruthy();
    expect(render(createRegistryDocument(), false).querySelector('h3')).toBeTruthy();
  });

  const links = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLAnchorElement>('a'));

  it('opens the PDF in a new tab from Preview', () => {
    const el = render(createRegistryDocument());
    const [preview] = links(el);

    expect(preview.textContent).toContain('Preview PDF');
    expect(preview.getAttribute('href')).toBe('https://cdn.example.com/doc-1.pdf');
    expect(preview.getAttribute('target')).toBe('_blank');
    expect(preview.getAttribute('rel')).toBe('noopener noreferrer');
    expect(el.querySelector('iframe')).toBeNull();
  });

  it('downloads the PDF as a file named after the document, without opening it', async () => {
    const blob = new Blob(['%PDF-1.7'], { type: 'application/pdf' });
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(blob, { status: 200 }));
    const saved: { href: string; download: string }[] = [];
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      saved.push({ href: this.href, download: this.download });
    });
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    URL.createObjectURL = vi.fn().mockReturnValue('blob:pdf');
    URL.revokeObjectURL = vi.fn();

    const el = render(createRegistryDocument());
    const download = links(el)[1];
    expect(download.getAttribute('aria-label')).toBe(
      'Download Policy Advisory & Regional Harmonization',
    );
    const click = new MouseEvent('click', { cancelable: true });
    download.dispatchEvent(click);
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve));

    expect(click.defaultPrevented).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith('https://cdn.example.com/doc-1.pdf');
    expect(saved).toEqual([
      { href: 'blob:pdf', download: 'Policy Advisory & Regional Harmonization.pdf' },
    ]);
    expect(openSpy).not.toHaveBeenCalled();
    vi.restoreAllMocks();
    clickSpy.mockRestore();
  });

  it('falls back to opening the PDF in a new tab when the download fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 401 }));
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

    const el = render(createRegistryDocument());
    links(el)[1].dispatchEvent(new MouseEvent('click', { cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve));

    expect(openSpy).toHaveBeenCalledWith(
      'https://cdn.example.com/doc-1.pdf',
      '_blank',
      'noopener,noreferrer',
    );
    vi.restoreAllMocks();
  });

  it('never links a non-http(s) document URL', () => {
    const el = render(createRegistryDocument({ downloadUrl: 'javascript:alert(1)' }));
    expect(links(el)).toHaveLength(0);
  });

  it('hides preview and download when the document has no file URL', () => {
    const el = render(createRegistryDocument({ downloadUrl: null }));
    expect(links(el)).toHaveLength(0);
  });
});
