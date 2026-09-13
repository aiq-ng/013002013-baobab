import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { HomePage } from './home.page';
import { EngagementService } from '../engagement/services/engagement.service';
import { SeoService } from '../../core/services/seo.service';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let seoUpdate: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    seoUpdate = vi.fn();

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        { provide: EngagementService, useValue: { submit: vi.fn() } },
        { provide: SeoService, useValue: { update: seoUpdate } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
  });

  it('sets the page SEO metadata on init', () => {
    expect(seoUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringMatching(/Home/) }),
    );
  });

  it('renders the hero, mission block, track model, and closing CTA band', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-home-hero')).toBeTruthy();
    expect(el.querySelector('app-mission-block')).toBeTruthy();
    expect(el.querySelector('app-track-model')).toBeTruthy();
    expect(el.querySelector('app-conciliation-cycle')).toBeTruthy();
    expect(el.querySelector('app-theater-previews')).toBeTruthy();
    expect(el.querySelector('app-cta-band')).toBeTruthy();
  });

  it('renders the "Our Supporters" partner logo strip', () => {
    expect(fixture.nativeElement.textContent).toContain('Our Supporters');
  });

  it('renders the impact stats row with 4 stats', () => {
    expect(fixture.nativeElement.querySelector('app-impact-stats')).toBeTruthy();
  });

  it('wraps the page content in a semantic <article>', () => {
    expect(fixture.nativeElement.querySelector('article')).toBeTruthy();
  });

  it('reveals the dialogue form only after the closing CTA is pressed', () => {
    expect(fixture.nativeElement.querySelector('app-dialogue-form')).toBeFalsy();

    fixture.componentInstance.showDialogueForm.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-dialogue-form')).toBeTruthy();
  });
});
