import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContactLocationBanner } from './location-banner';

describe('ContactLocationBanner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ContactLocationBanner] });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(ContactLocationBanner);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a labelled photo of the head office', () => {
    const fixture = TestBed.createComponent(ContactLocationBanner);
    fixture.detectChanges();
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.attributes['alt']).toContain('Dakar');
  });
});
