import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let title: Title;
  let meta: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);
  });

  it('sets the page title suffixed with the brand name', () => {
    service.update({ title: 'About Us', description: 'Mission and mandate.' });

    expect(title.getTitle()).toBe('About Us | The Baobab Group');
  });

  it('sets description and Open Graph tags', () => {
    service.update({ title: 'Contact', description: 'Reach our delegation.' });

    expect(meta.getTag('name="description"')?.content).toBe('Reach our delegation.');
    expect(meta.getTag('property="og:title"')?.content).toBe('Contact | The Baobab Group');
    expect(meta.getTag('property="og:description"')?.content).toBe('Reach our delegation.');
    expect(meta.getTag('property="og:type"')?.content).toBe('website');
  });

  it('sets og:image only when an image is provided', () => {
    service.update({ title: 'Home', description: 'Overview.' });
    expect(meta.getTag('property="og:image"')).toBeNull();

    service.update({ title: 'Home', description: 'Overview.', image: '/og.png' });
    expect(meta.getTag('property="og:image"')?.content).toBe('/og.png');
  });

  it('sets og:url only when a url is provided', () => {
    service.update({ title: 'Home', description: 'Overview.', url: 'https://example.org' });
    expect(meta.getTag('property="og:url"')?.content).toBe('https://example.org');
  });

  it('does not set a robots tag by default', () => {
    service.update({ title: 'Home', description: 'Overview.' });
    expect(meta.getTag('name="robots"')).toBeNull();
  });

  it('sets a noindex robots tag when noIndex is true', () => {
    service.update({ title: 'Not Found', description: 'Missing page.', noIndex: true });
    expect(meta.getTag('name="robots"')?.content).toBe('noindex, nofollow');
  });
});
