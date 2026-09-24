import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ProgramEditPage, slugify } from './program-edit.page';
import { ConsoleStore } from '../../../services/console-store';
import { SeoService } from '../../../../../core/services/seo.service';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { contentOf, createBodyOf, makeProgram } from '../../../../programs/testing/program-fixture';

describe('ProgramEditPage', () => {
  let fixture: ComponentFixture<ProgramEditPage>;
  let store: Partial<ConsoleStore>;
  let toast: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  let router: Router;

  const program = makeProgram({ slug: 'program-1', title: 'Liptako-Gourma Peace Corridor' });

  async function setup(slug: string | null) {
    store = {
      programs: signal([program]),
      programsLoading: signal(false),
      loadPrograms: vi.fn().mockResolvedValue(undefined),
      saveProgram: vi.fn().mockResolvedValue(undefined),
      createProgram: vi.fn().mockResolvedValue(undefined),
    };
    toast = { success: vi.fn(), error: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ProgramEditPage],
      providers: [
        provideRouter([]),
        { provide: ConsoleStore, useValue: store },
        { provide: SeoService, useValue: { update: vi.fn() } },
        { provide: ToastService, useValue: toast },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => slug } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramEditPage);
    fixture.detectChanges();
    await fixture.whenStable();
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    return fixture.componentInstance;
  }

  describe('editing an existing program', () => {
    it('pre-populates every field, including the repeatable lists', async () => {
      const component = await setup('program-1');
      const value = component.form.getRawValue();

      expect(value.title).toBe('Liptako-Gourma Peace Corridor');
      expect(value.referenceCode).toBe(program.referenceCode);
      expect(value.kpis).toEqual([
        { value: '3', unit: 'Systems', label: 'States Bound' },
        { value: '98%', unit: '', label: 'Community Acceptance' },
      ]);
      expect(value.doctrineParagraphs).toEqual(program.doctrineParagraphs);
      expect(value.pillars[0].title).toBe('Hydraulic Rotational Clocks');
      expect(value.milestones[0].tags).toBe('12 Wells');
    });

    it('does not offer a slug field — the public URL never changes', async () => {
      await setup('program-1');
      expect(fixture.nativeElement.querySelector('#slug')).toBeNull();
    });

    it('blocks submit when a required field is empty', async () => {
      const component = await setup('program-1');
      component.form.controls.title.setValue('');

      await component.onSubmit();

      expect(store.saveProgram).not.toHaveBeenCalled();
      expect(component.form.controls.title.invalid).toBe(true);
    });

    it('blocks submit for an image URL that is neither a site path nor https', async () => {
      const component = await setup('program-1');
      component.form.controls.imageUrl.setValue('javascript:alert(1)');

      await component.onSubmit();

      expect(store.saveProgram).not.toHaveBeenCalled();
    });

    it('saves the full content — blank units as null, tags split on commas — then returns to the list', async () => {
      const component = await setup('program-1');
      component.form.controls.title.setValue('New Title');
      component.form.controls.milestones.at(0).controls.tags.setValue(' A , B,, C ');

      await component.onSubmit();

      const content = contentOf(program);
      expect(store.saveProgram).toHaveBeenCalledWith('program-1', {
        ...content,
        title: 'New Title',
        milestones: [{ ...program.milestones[0], tags: ['A', 'B', 'C'] }],
      });
      expect(router.navigate).toHaveBeenCalledWith(['/console/programs']);
    });

    it('reports a failed save and stays on the page', async () => {
      const component = await setup('program-1');
      store.saveProgram = vi.fn().mockRejectedValue(new Error('500'));

      await component.onSubmit();

      expect(toast.error).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('repeatable lists', () => {
    it('adds KPIs up to the four the detail grid holds', async () => {
      const component = await setup('program-1');
      component.addKpi();
      component.addKpi();
      component.addKpi();

      expect(component.form.controls.kpis.length).toBe(4);
      expect(component.canAdd('kpis')).toBe(false);
    });

    it('never removes the last row of a list', async () => {
      const component = await setup('program-1');
      component.removeAt('pillars', 0);

      expect(component.form.controls.pillars.length).toBe(1);
      expect(component.canRemove('pillars')).toBe(false);
    });

    it('removes a row when more than one exists', async () => {
      const component = await setup('program-1');
      component.addParagraph();
      component.removeAt('doctrineParagraphs', 0);

      expect(component.form.controls.doctrineParagraphs.getRawValue()).toEqual([
        program.doctrineParagraphs[1],
        '',
      ]);
    });
  });

  describe('creating a program', () => {
    it('starts from sensible defaults with one row per list', async () => {
      const component = await setup(null);
      const value = component.form.getRawValue();

      expect(component.isNew).toBe(true);
      expect(value.title).toBe('');
      expect(value.doctrineEyebrow).toBe('STRATEGIC OPERATIONAL DOCTRINE');
      expect(value.kpis).toHaveLength(1);
      expect(value.pillars).toHaveLength(1);
      expect(value.milestones).toHaveLength(1);
    });

    it('derives the slug from the title until the slug is edited by hand', async () => {
      const component = await setup(null);
      component.form.controls.title.setValue('Sahel Water & Grazing Accords');
      expect(component.slugControl.value).toBe('sahel-water-grazing-accords');

      component.slugControl.setValue('custom-slug');
      component.slugControl.markAsDirty();
      component.form.controls.title.setValue('Something Else');
      expect(component.slugControl.value).toBe('custom-slug');
    });

    it('rejects a slug that is not lowercase-hyphenated', async () => {
      const component = await setup(null);
      component.slugControl.setValue('Not A Slug');
      expect(component.slugControl.hasError('pattern')).toBe(true);
    });

    it('creates the program with its slug and returns to the list', async () => {
      const component = await setup(null);
      const body = createBodyOf(
        makeProgram({
          slug: 'new-program',
          kpis: [{ value: '3', unit: null, label: 'States Bound' }],
        }),
      );
      component.patchFromProgram(body);
      component.slugControl.setValue('new-program');

      await component.onSubmit();

      expect(store.createProgram).toHaveBeenCalledWith(body);
      expect(router.navigate).toHaveBeenCalledWith(['/console/programs']);
    });

    it('explains a slug clash instead of a generic failure', async () => {
      const component = await setup(null);
      const body = createBodyOf(makeProgram());
      component.patchFromProgram(body);
      component.slugControl.setValue(body.slug);
      store.createProgram = vi.fn().mockRejectedValue(new HttpErrorResponse({ status: 409 }));

      await component.onSubmit();

      expect(toast.error).toHaveBeenCalledWith('A program with this slug already exists.');
    });
  });

  it('slugify strips accents and punctuation', () => {
    expect(slugify('Côte d’Ivoire — Border Accords!')).toBe('cote-d-ivoire-border-accords');
  });
});
