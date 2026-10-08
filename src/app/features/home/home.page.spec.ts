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
        {
          provide: EngagementService,
          useValue: { submit: vi.fn(), generateIdempotencyKey: () => 'key-1' },
        },
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

  it('renders every home section in design order', () => {
    const el: HTMLElement = fixture.nativeElement;
    const order = [
      'app-home-hero',
      'app-mission-block',
      'app-partner-categories',
      'app-track-model',
      'app-programs-preview',
      'app-expected-impact',
      'app-cta-band',
    ];
    const found = order.map((sel) => el.querySelector(sel));
    found.forEach((node) => expect(node).toBeTruthy());
    for (let i = 1; i < found.length; i++) {
      expect(
        found[i - 1]!.compareDocumentPosition(found[i]!) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });

  it('renders the trust banner copy from the design export', () => {
    expect(fixture.nativeElement.textContent.replace(/\s+/g, ' ')).toContain(
      'African-Led · Trusted By Communities · Bridges ECOWAS and AES · Confidential and Results-Oriented',
    );
  });

  it('renders the closing CTA copy from the design export', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain(
      'Peace is strongest when it is locally owned, nationally supported, and regionally sustained.',
    );
    expect(text).toContain(
      'Together, we build a West Africa where peace takes root and future generations thrive.',
    );
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
