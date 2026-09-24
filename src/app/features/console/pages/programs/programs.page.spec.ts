import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ProgramsPage } from './programs.page';
import { ConsoleStore } from '../../services/console-store';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { makeProgram } from '../../../programs/testing/program-fixture';

describe('ProgramsPage', () => {
  let fixture: ComponentFixture<ProgramsPage>;
  let store: Partial<ConsoleStore>;
  let toast: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  const el = (): HTMLElement => fixture.nativeElement;
  const deleteButtons = (): HTMLButtonElement[] =>
    Array.from(el().querySelectorAll('button[data-testid="program-delete-btn"]'));
  const dialog = (): HTMLElement | null => el().querySelector('[role="dialog"]');

  beforeEach(async () => {
    const programs = Array.from({ length: 6 }, (_, i) =>
      makeProgram({ slug: `program-${i + 1}`, sortOrder: i + 1, title: `Program ${i + 1}` }),
    );
    store = {
      programs: signal(programs),
      programsLoading: signal(false),
      loadPrograms: vi.fn().mockResolvedValue(undefined),
      deleteProgram: vi.fn().mockResolvedValue(undefined),
    };
    toast = { success: vi.fn(), error: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ProgramsPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramsPage);
    fixture.detectChanges();
  });

  it('loads programs on init', () => {
    expect(store.loadPrograms).toHaveBeenCalled();
  });

  it('renders a row per program', () => {
    const rows = el().querySelectorAll('[data-testid="program-row"]');
    expect(rows.length).toBe(6);
  });

  it('renders Edit links pointing to /console/programs/:slug', () => {
    const links: HTMLAnchorElement[] = Array.from(
      el().querySelectorAll('a[data-testid="program-edit-link"]'),
    );
    expect(links.length).toBe(6);
    expect(links[0].getAttribute('href')).toBe('/console/programs/program-1');
    expect(links[5].getAttribute('href')).toBe('/console/programs/program-6');
  });

  it('links to the new-program form', () => {
    expect(el().querySelector('a[href="/console/programs/new"]')).toBeTruthy();
  });

  it('no longer describes programs as a fixed set', () => {
    expect(el().textContent).not.toContain('fixed set');
    expect(el().textContent).not.toContain('permanently disabled');
  });

  it('asks for confirmation before deleting, naming the program', () => {
    deleteButtons()[1].click();
    fixture.detectChanges();

    expect(store.deleteProgram).not.toHaveBeenCalled();
    expect(dialog()?.textContent).toContain('Program 2');
  });

  it('deletes the confirmed program and closes the dialog', async () => {
    deleteButtons()[1].click();
    fixture.detectChanges();

    (dialog()!.querySelector('[data-testid="confirm-delete-btn"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(store.deleteProgram).toHaveBeenCalledWith('program-2');
    expect(toast.success).toHaveBeenCalled();
    expect(dialog()).toBeNull();
  });

  it('cancelling the dialog deletes nothing', () => {
    deleteButtons()[0].click();
    fixture.detectChanges();

    (dialog()!.querySelector('[data-testid="cancel-delete-btn"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(store.deleteProgram).not.toHaveBeenCalled();
    expect(dialog()).toBeNull();
  });

  it('reports a failed delete', async () => {
    store.deleteProgram = vi.fn().mockRejectedValue(new Error('500'));
    deleteButtons()[0].click();
    fixture.detectChanges();

    (dialog()!.querySelector('[data-testid="confirm-delete-btn"]') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(toast.error).toHaveBeenCalled();
  });
});
