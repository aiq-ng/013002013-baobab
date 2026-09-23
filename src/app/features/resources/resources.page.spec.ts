import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ResourcesPage } from './resources.page';
import { ArchiveApi } from './services/archive.api';
import { ArchiveEntry } from './models/resource';

const ARCHIVE_ENTRY: ArchiveEntry = {
  id: 'entry-1',
  refCode: 'REF: BBG-LQ-2023-TRX',
  regionTag: 'Sahel Central Basin',
  statusTag: 'Ratified: November 2023 · In Active Force',
  title: 'Liptako-Gourma Tri-Border Accord & Customary Grazing Charter',
  description: 'Tripartite non-aggression and dry-season corridor demarcations.',
  ratifyingParties: 'Delegations of Mali, Niger, Burkina Faso',
  workingLanguages: 'Français, Hausa, Fulfulde, Tamasheq',
  category: 'Transhumance',
};

describe('ResourcesPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResourcesPage],
      providers: [
        provideRouter([]),
        { provide: ArchiveApi, useValue: { list: () => of([ARCHIVE_ENTRY]) } },
      ],
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

  it('renders the hero, featured document, treaties archive, doctrine, and data protections', async () => {
    const fixture = TestBed.createComponent(ResourcesPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Declassified Diplomatic Communiqués');
    expect(text).toContain('Annual Statecraft Review');
    expect(text).toContain('Treaties & Conciliation Archive');
    expect(text).toContain('Liptako-Gourma Tri-Border Accord');
    expect(text).toContain('The Neutral Sovereign Sanctuary Doctrine');
    expect(text).toContain('Privacy & Sovereign Data Protections');
  });

  it('does not render the published registry documents section', () => {
    const fixture = TestBed.createComponent(ResourcesPage);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;

    expect(text).not.toContain('Published Registry Documents');
  });
});
