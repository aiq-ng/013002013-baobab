import { TestBed } from '@angular/core/testing';
import { DoctrineSection } from './doctrine-section';

describe('DoctrineSection', () => {
  it('renders the heading, paragraphs, and inline stats', () => {
    TestBed.configureTestingModule({ imports: [DoctrineSection] });
    const fixture = TestBed.createComponent(DoctrineSection);
    fixture.componentRef.setInput('eyebrow', 'STRATEGIC OPERATIONAL DOCTRINE');
    fixture.componentRef.setInput('heading', 'Codified Water Sharing');
    fixture.componentRef.setInput('paragraphs', ['First paragraph.', 'Second paragraph.']);
    fixture.componentRef.setInput('imageUrl', '/images/about/program-gourma-wells.jpg');
    fixture.componentRef.setInput('imageCaption', 'SECTOR GOURMA');
    fixture.componentRef.setInput('stats', [
      { value: '420', unit: 'km', label: 'Surveyed Corridors' },
    ]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Codified Water Sharing');
    expect(text).toContain('First paragraph.');
    expect(text).toContain('420 km');
    expect(text).toContain('Surveyed Corridors');
  });
});
