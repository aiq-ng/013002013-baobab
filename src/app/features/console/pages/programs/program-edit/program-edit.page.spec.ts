import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ProgramEditPage } from './program-edit.page';
import { ConsoleStore } from '../../../services/console-store';
import { SeoService } from '../../../../../core/services/seo.service';
import { AdminProgram } from '../../../models/admin';

describe('ProgramEditPage', () => {
  let fixture: ComponentFixture<ProgramEditPage>;
  let store: Partial<ConsoleStore>;
  let router: Router;

  const program: AdminProgram = {
    slug: 'program-1',
    sortOrder: 1,
    title: 'Liptako-Gourma Peace Corridor',
    description: 'Cross-border peacebuilding initiative.',
    imageUrl: '/images/program-1.jpg',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    store = {
      programs: signal([program]),
      programsLoading: signal(false),
      loadPrograms: vi.fn().mockResolvedValue(undefined),
      saveProgram: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ProgramEditPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'program-1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramEditPage);
    fixture.detectChanges();
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('pre-populates the form from the loaded program', () => {
    const component = fixture.componentInstance;
    expect(component.form.value.title).toBe('Liptako-Gourma Peace Corridor');
    expect(component.form.value.description).toBe('Cross-border peacebuilding initiative.');
  });

  it('blocks submit when title is empty', async () => {
    const component = fixture.componentInstance;
    component.form.controls.title.setValue('');
    await component.onSubmit();

    expect(store.saveProgram).not.toHaveBeenCalled();
    expect(component.form.controls.title.invalid).toBe(true);
  });

  it('calls store.saveProgram with slug and patch, then navigates back', async () => {
    const component = fixture.componentInstance;
    component.form.controls.title.setValue('New Title');
    component.form.controls.description.setValue('New description.');

    await component.onSubmit();

    expect(store.saveProgram).toHaveBeenCalledWith('program-1', {
      title: 'New Title',
      description: 'New description.',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/console/programs']);
  });
});
