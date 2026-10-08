import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { ContactPage } from './contact.page';
import { SeoService } from '../../core/services/seo.service';

describe('ContactPage', () => {
  it('creates and sets SEO metadata', () => {
    const update = vi.fn();
    TestBed.configureTestingModule({
      imports: [ContactPage],
      providers: [provideRouter([]), { provide: SeoService, useValue: { update } }],
    });

    const fixture = TestBed.createComponent(ContactPage);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ title: 'Contact Us' }));
  });

  it('ends at the FAQ — no closing CTA band competing with the form', () => {
    TestBed.configureTestingModule({
      imports: [ContactPage],
      providers: [provideRouter([]), { provide: SeoService, useValue: { update: vi.fn() } }],
    });
    const fixture = TestBed.createComponent(ContactPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-cta-band')).toBeNull();
  });
});
