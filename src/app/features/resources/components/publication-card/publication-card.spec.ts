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

  const previewToggle = (el: HTMLElement) =>
    Array.from(el.querySelectorAll('button')).find((b) =>
      b.textContent!.includes('Preview PDF'),
    ) as HTMLButtonElement;

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

  it('renders a labelled download link to the document', () => {
    const el = render(createRegistryDocument());
    const link = el.querySelector('a[download]') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('https://cdn.example.com/doc-1.pdf');
    expect(link.getAttribute('aria-label')).toContain(
      'Download Policy Advisory & Regional Harmonization',
    );
  });

  it('keeps the inline preview collapsed until "Preview PDF" is pressed', () => {
    const el = render(createRegistryDocument());
    const toggle = previewToggle(el);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('iframe')).toBeNull();

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const frame = el.querySelector('iframe') as HTMLIFrameElement;
    expect(frame.getAttribute('src')).toBe('https://cdn.example.com/doc-1.pdf');
    expect(frame.getAttribute('title')).toContain('Policy Advisory & Regional Harmonization');
    expect(toggle.getAttribute('aria-controls')).toBe(frame.parentElement!.id);
  });

  it('collapses the preview again on a second press', () => {
    const el = render(createRegistryDocument());
    const toggle = previewToggle(el);
    toggle.click();
    fixture.detectChanges();
    toggle.click();
    fixture.detectChanges();
    expect(el.querySelector('iframe')).toBeNull();
  });

  it('never embeds a non-http(s) document URL', () => {
    const el = render(createRegistryDocument({ downloadUrl: 'javascript:alert(1)' }));
    expect(previewToggle(el)).toBeUndefined();
    expect(el.querySelector('a[download]')).toBeNull();
  });

  it('hides preview and download when the document has no file URL', () => {
    const el = render(createRegistryDocument({ downloadUrl: null }));
    expect(previewToggle(el)).toBeUndefined();
    expect(el.querySelector('a[download]')).toBeNull();
  });
});
