import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { PartnershipsPage } from './partnerships.page';

describe('PartnershipsPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PartnershipsPage],
      providers: [provideRouter([]), Title, Meta],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(PartnershipsPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sets page SEO metadata', () => {
    const fixture = TestBed.createComponent(PartnershipsPage);
    fixture.detectChanges();
    const title = TestBed.inject(Title);
    expect(title.getTitle()).toContain('Partnerships');
  });

  it('renders the hero, feature cards, dialogue form, and partner groups', () => {
    const fixture = TestBed.createComponent(PartnershipsPage);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Partner with us for a stronger West Africa.');
    expect(text).toContain('Governments and regional bodies');
    expect(text).toContain('Start a conversation');
    expect(text).toContain('Our Partners');
    for (const group of [
      'Governments and Local Authorities',
      'Traditional and Religious Institutions',
      'ECOWAS, AES and AU',
      'Agencies and International Partners',
      'Civil Society and Community Organizations',
    ]) {
      expect(text).toContain(group);
    }
  });
});
