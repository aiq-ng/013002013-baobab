import { TestBed } from '@angular/core/testing';
import { ImageBanner } from './image-banner';

describe('ImageBanner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ImageBanner] });
  });

  it('renders the banner image with descriptive alt text', () => {
    const fixture = TestBed.createComponent(ImageBanner);
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('src')).toContain('/images/about/amani-africa-banner.jpg');
    expect(img.getAttribute('alt')).toBeTruthy();
  });

  it('renders the caption pill', () => {
    const fixture = TestBed.createComponent(ImageBanner);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Frontiers for peace and stability in the West African region',
    );
  });
});
