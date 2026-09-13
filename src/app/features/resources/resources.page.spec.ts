import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ResourcesPage } from './resources.page';

describe('ResourcesPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResourcesPage],
      providers: [provideRouter([])],
    });
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(ResourcesPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sets the page title via SeoService on init', () => {
    const fixture = TestBed.createComponent(ResourcesPage);
    fixture.detectChanges();
    expect(TestBed.inject(Title).getTitle()).toContain('Resources');
  });

  it('renders the hero, featured document, treaties archive, doctrine, and data protections', () => {
    const fixture = TestBed.createComponent(ResourcesPage);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Declassified Diplomatic Communiqués');
    expect(text).toContain('Annual Statecraft Review');
    expect(text).toContain('Treaties & Conciliation Archive');
    expect(text).toContain('Liptako-Gourma Tri-Border Accord');
    expect(text).toContain('The Neutral Sovereign Sanctuary Doctrine');
    expect(text).toContain('Privacy & Sovereign Data Protections');
  });
});
