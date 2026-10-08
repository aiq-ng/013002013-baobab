import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ResourcesPage } from './resources.page';
import { ResourcesApi } from './services/resources.api';
import { EngagementService } from '../engagement/services/engagement.service';
import { createRegistryDocument } from './testing/resource-fixture';
import { RegistryDocument } from './models/resource';

const DOCUMENTS: RegistryDocument[] = [
  createRegistryDocument({ id: 'newest', title: 'Policy Advisory & Regional Harmonization' }),
  createRegistryDocument({ id: 'b', title: 'Sovereign Dialogue Facilitation' }),
  createRegistryDocument({ id: 'c', title: 'Hybrid Mediation & Reconciliation' }),
];

describe('ResourcesPage', () => {
  function setup(list: () => ReturnType<ResourcesApi['list']>) {
    TestBed.configureTestingModule({
      imports: [ResourcesPage],
      providers: [
        provideRouter([]),
        { provide: ResourcesApi, useValue: { list } },
        {
          provide: EngagementService,
          useValue: { submit: vi.fn(), generateIdempotencyKey: () => 'key-1' },
        },
      ],
    });
  }

  async function render() {
    const fixture = TestBed.createComponent(ResourcesPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('sets the page title via SeoService on init', async () => {
    setup(() => of(DOCUMENTS));
    await render();
    expect(TestBed.inject(Title).getTitle()).toContain('Resources');
  });

  it('features the newest publication and lists the rest beneath it', async () => {
    setup(() => of(DOCUMENTS));
    const fixture = await render();
    const el: HTMLElement = fixture.nativeElement;

    const featured = el.querySelector('[data-testid="featured-publication"]')!;
    expect(featured.textContent).toContain('Policy Advisory & Regional Harmonization');

    const listed = Array.from(el.querySelectorAll('app-publications-list h3')).map((h) =>
      h.textContent!.trim(),
    );
    expect(listed).toEqual([
      'Sovereign Dialogue Facilitation',
      'Hybrid Mediation & Reconciliation',
    ]);
  });

  it('renders the "Stay informed" newsletter band wired to its own engagement source', async () => {
    setup(() => of(DOCUMENTS));
    const fixture = await render();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Receive new publications and updates from The Baobab Group.');
    expect(el.querySelector('app-dispatch-form')).toBeTruthy();
  });

  it('shows an error state with a retry when publications fail to load', async () => {
    const list = vi
      .fn()
      .mockReturnValueOnce(throwError(() => new Error('down')))
      .mockReturnValue(of(DOCUMENTS));
    setup(list);
    const fixture = await render();
    const el: HTMLElement = fixture.nativeElement;

    const panel = el.querySelector('app-status-panel')!;
    expect(panel.textContent).toContain('Publications are unavailable');

    (panel.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(list).toHaveBeenCalledTimes(2);
    expect(el.textContent).toContain('Sovereign Dialogue Facilitation');
  });

  it('no longer renders the removed doctrine, access gate, or data protections sections', async () => {
    setup(() => of(DOCUMENTS));
    const fixture = await render();
    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('Track 1.5 Access Gate');
    expect(text).not.toContain('Sovereign Addendum Dispatch');
    expect(text).not.toContain('Privacy & Sovereign Data Protections');
  });
});
