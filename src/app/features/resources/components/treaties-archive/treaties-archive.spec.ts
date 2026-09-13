import { TestBed } from '@angular/core/testing';
import { TreatiesArchive } from './treaties-archive';
import { ArchiveEntry } from '../../models/resource';

const ENTRIES: ArchiveEntry[] = [
  {
    refCode: 'REF-1',
    regionTag: 'Region A',
    statusTag: 'Ratified: 2023',
    title: 'Transhumance Accord One',
    description: 'Desc one',
    ratifyingParties: 'Party A',
    workingLanguages: 'English',
    category: 'Transhumance',
  },
  {
    refCode: 'REF-2',
    regionTag: 'Region B',
    statusTag: 'Ratified: 2024',
    title: 'Riparian Protocol Two',
    description: 'Desc two',
    ratifyingParties: 'Party B',
    workingLanguages: 'Français',
    category: 'Riparian & Water',
  },
];

describe('TreatiesArchive', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<TreatiesArchive>>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TreatiesArchive] });
    fixture = TestBed.createComponent(TreatiesArchive);
    fixture.componentInstance.entries = ENTRIES;
    fixture.detectChanges();
  });

  it('renders all entries under the "All Accords" filter by default', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Transhumance Accord One');
    expect(text).toContain('Riparian Protocol Two');
  });

  it('filters the list to only the selected category when a pill is clicked', () => {
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    const transhumancePill = buttons.find((b) => b.textContent?.trim() === 'Transhumance');
    transhumancePill?.click();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Transhumance Accord One');
    expect(text).not.toContain('Riparian Protocol Two');
  });

  it('returns to showing everything when "All Accords" is re-selected', () => {
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    buttons.find((b) => b.textContent?.trim() === 'Riparian & Water')?.click();
    fixture.detectChanges();
    buttons.find((b) => b.textContent?.trim() === 'All Accords')?.click();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Transhumance Accord One');
    expect(text).toContain('Riparian Protocol Two');
  });
});
