import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ProgramsPage } from './programs.page';
import { ConsoleStore } from '../../services/console-store';
import { SeoService } from '../../../../core/services/seo.service';
import { AdminProgram } from '../../models/admin';

function makeProgram(i: number): AdminProgram {
  return {
    slug: `program-${i}`,
    sortOrder: i,
    title: `Program ${i}`,
    description: `Description for program ${i} that is reasonably long so it can be truncated in the table view.`,
    imageUrl: `/images/program-${i}.jpg`,
    updatedAt: '2026-01-01T00:00:00Z',
  };
}

describe('ProgramsPage', () => {
  let fixture: ComponentFixture<ProgramsPage>;
  let store: Partial<ConsoleStore>;

  beforeEach(async () => {
    const programs = Array.from({ length: 6 }, (_, i) => makeProgram(i + 1));
    store = {
      programs: signal(programs),
      programsLoading: signal(false),
      loadPrograms: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ProgramsPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramsPage);
    fixture.detectChanges();
  });

  it('loads programs on init', () => {
    expect(store.loadPrograms).toHaveBeenCalled();
  });

  it('renders all 6 program rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('[data-testid="program-row"]');
    expect(rows.length).toBe(6);
  });

  it('renders Edit links pointing to /console/programs/:slug', () => {
    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('a[data-testid="program-edit-link"]'),
    );
    expect(links.length).toBe(6);
    expect(links[0].getAttribute('href')).toBe('/console/programs/program-1');
    expect(links[5].getAttribute('href')).toBe('/console/programs/program-6');
  });
});
