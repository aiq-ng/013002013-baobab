import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SanctuaryDoctrine } from './sanctuary-doctrine';

describe('SanctuaryDoctrine', () => {
  it('renders the doctrine heading, explainer text, non-disclosure note, and the access gate form', () => {
    TestBed.configureTestingModule({
      imports: [SanctuaryDoctrine],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(SanctuaryDoctrine);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('The Neutral Sovereign Sanctuary Doctrine');
    expect(text).toContain('By joint bilateral decree of West African signatory ministries');
    expect(text).toContain('Non-Disclosure & Immunity Standard');
    expect(text).toContain('Track 1.5 Access Gate');
  });
});
