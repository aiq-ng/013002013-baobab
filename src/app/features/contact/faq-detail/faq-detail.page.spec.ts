import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { FaqDetailPage } from './faq-detail.page';
import { SeoService } from '../../../core/services/seo.service';

describe('FaqDetailPage', () => {
  it('creates, sets SEO metadata, and renders all 5 directives with a working breadcrumb', () => {
    const update = vi.fn();
    TestBed.configureTestingModule({
      imports: [FaqDetailPage],
      providers: [provideRouter([]), { provide: SeoService, useValue: { update } }],
    });

    const fixture = TestBed.createComponent(FaqDetailPage);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Key Mandates & Sovereign Protocols' }),
    );

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Home');
    expect(text).toContain('Contact Us');
    expect(text).toContain('Frequently Asked Questions');
    expect(fixture.componentInstance.directives.length).toBe(5);
    expect(text).toContain('How can my government or institution initiate a dialogue?');
    expect(text).toContain('Can researchers or journalists request access to your archive?');
    expect(text).toContain('Direct Assistance');
    expect(text).toContain('Open Diplomatic Dispatch');
  });
});
