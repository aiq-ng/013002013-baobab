import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { vi } from 'vitest';
import { ProgramDetailPage } from './program-detail.page';

function configureWithSlug(slug: string | null) {
  TestBed.configureTestingModule({
    imports: [ProgramDetailPage],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap(slug ? { slug } : {}) } },
      },
    ],
  });
}

describe('ProgramDetailPage', () => {
  it('renders the matched program (hero, KPIs, doctrine, pillars, timeline, dispatch form)', () => {
    configureWithSlug('gourma-pastoral-wells-demarcation');
    const fixture = TestBed.createComponent(ProgramDetailPage);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Gourma Pastoral Wells & Riparian Demarcation');
    expect(text).toContain('ACTIVE HYDRAULIC ACCORD');
    expect(text).toContain('Codified Water Sharing and Seasonal Grazing Harmony');
    expect(text).toContain('Hydraulic Rotational Clocks');
    expect(text).toContain('Hombori Basin Water Allocation Framework Ratified');
    expect(text).toContain('Request Confidential Addenda & Aquifer Telemetry Data');
  });

  it('sets the page title via SeoService on init', () => {
    configureWithSlug('gourma-pastoral-wells-demarcation');
    const fixture = TestBed.createComponent(ProgramDetailPage);
    fixture.detectChanges();
    expect(TestBed.inject(Title).getTitle()).toContain(
      'Gourma Pastoral Wells & Riparian Demarcation',
    );
  });

  it('redirects to not-found for an unknown slug', () => {
    configureWithSlug('not-a-real-program');
    const fixture = TestBed.createComponent(ProgramDetailPage);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/not-found']);
    expect(fixture.nativeElement.querySelector('article')).toBeFalsy();
  });
});
