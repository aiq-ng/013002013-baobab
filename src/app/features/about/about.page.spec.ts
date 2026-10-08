import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AboutPage } from './about.page';

describe('AboutPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AboutPage],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(AboutPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sets the page title via SeoService on init', () => {
    const fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    expect(TestBed.inject(Title).getTitle()).toContain('About Us');
  });

  it('renders every section of the design export in order', () => {
    const fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    const markers = [
      'An African-led institution for peace and dialogue.',
      'Frontiers for peace and stability in the West African region',
      'OUR MISSION',
      'Our Partners',
      'Why Baobab?',
      'Our distinctive approach',
      'Our values',
      'We work across ECOWAS and AES countries.',
    ];
    const positions = markers.map((m) => text.indexOf(m));
    positions.forEach((p, i) => expect(p, markers[i]).toBeGreaterThan(-1));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('no longer renders the removed programs grid or theater map', () => {
    const fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    const text: string = fixture.nativeElement.textContent;
    expect(text).not.toContain('Active Programs & Theaters');
    expect(text).not.toContain('All Theaters');
  });
});
