import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ResourceHighlight } from './resource-highlight';

describe('ResourceHighlight', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResourceHighlight],
      providers: [provideRouter([])],
    });
  });

  it('renders the featured document title, chapters, excerpt, and both real links', () => {
    const fixture = TestBed.createComponent(ResourceHighlight);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Annual Statecraft Review');
    expect(text).toContain(
      'De-escalating Structural Friction: Customary Jurisprudence & Pastoral Corridors in the Sahel',
    );
    expect(text).toContain('Ch. I: Sultanate Water Rights');
    expect(text).toContain('View Document Online');
    expect(text).toContain('Download Dossier PDF');

    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    const downloadLink = links.find((a) => a.textContent?.includes('Download Dossier PDF'));
    expect(downloadLink?.getAttribute('href')).toBeTruthy();
  });

  it('renders the addendum dispatch form and the document metadata grid', () => {
    const fixture = TestBed.createComponent(ResourceHighlight);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Sovereign Addendum Dispatch');
    expect(text).toContain('Diplomatic Classification');
    expect(text).toContain('Unrestricted Track 1.5');
    expect(text).toContain('Dakar High Tribunal Archive');
  });
});
