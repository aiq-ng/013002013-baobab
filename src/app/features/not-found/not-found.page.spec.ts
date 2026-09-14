import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { NotFoundPage } from './not-found.page';
import { SeoService } from '../../core/services/seo.service';

describe('NotFoundPage', () => {
  let update: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    update = vi.fn();
    await TestBed.configureTestingModule({
      imports: [NotFoundPage],
      providers: [provideRouter([]), { provide: SeoService, useValue: { update } }],
    }).compileComponents();
  });

  it('sets a noindex SEO title on init', () => {
    TestBed.createComponent(NotFoundPage).detectChanges();

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Page Not Found', noIndex: true }),
    );
  });

  it('renders a heading and a real link back home', () => {
    const fixture = TestBed.createComponent(NotFoundPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Page not found');
    const link = fixture.nativeElement.querySelector('a[href="/"]');
    expect(link).toBeTruthy();
  });
});
