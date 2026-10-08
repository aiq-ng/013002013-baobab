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

  const program = makeProgram({ slug: 'program-1', title: 'Hybrid Mediation & Reconciliation' });

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

      expect(value.title).toBe('Hybrid Mediation & Reconciliation');
      expect(value.badgeText).toBe('ALL REGIONS');
      expect(value.aboutParagraphs).toEqual(program.aboutParagraphs);
      expect(value.keyPoints).toEqual(program.keyPoints);
      expect(value.strategyHeading).toBe(program.strategyHeading);
      expect(value.strategyImageUrl).toBe(program.strategyImageUrl);
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

    it('saves the full content, trimmed, then confirms it', async () => {
      const component = await setup('program-1');
      component.form.controls.title.setValue('New Title');
      component.form.controls.keyPoints.at(0).setValue('  Trimmed point  ');

      await component.onSubmit();

      const content = contentOf(program);
      expect(store.saveProgram).toHaveBeenCalledWith('program-1', {
        ...content,
        title: 'New Title',
        keyPoints: ['Trimmed point', program.keyPoints[1]],
      });
      expect(router.navigate).not.toHaveBeenCalled();
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('h1')?.textContent).toContain('Program Updated & Published');
      expect(el.textContent).toContain('New Title');
      const publicLink = el.querySelector('a[data-testid="view-public"]') as HTMLAnchorElement;
      expect(publicLink.getAttribute('href')).toBe('/programs/program-1');
      expect(publicLink.getAttribute('target')).toBe('_blank');
      expect(publicLink.getAttribute('rel')).toContain('noopener');
      expect(el.querySelector('a[href="/console/programs"]')?.textContent).toContain(
        'Return to Programs List',
      );
    });

    it('offers to edit the program again after publishing', async () => {
      const component = await setup('program-1');
      await component.onSubmit();
      fixture.detectChanges();

      const again = Array.from(
        fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
      ).find((b) => b.textContent?.includes('Edit this program again'))!;
      again.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('form')).toBeTruthy();
    });

    it('rejects a javascript: image URL', async () => {
      const component = await setup('program-1');
      component.form.controls.imageUrl.setValue('javascript:alert(1)');
      await component.onSubmit();
      expect(store.saveProgram).not.toHaveBeenCalled();
    });

    it('treats a whitespace-only heading as missing', async () => {
      const component = await setup('program-1');
      component.form.controls.title.setValue('   ');
      await component.onSubmit();
      expect(store.saveProgram).not.toHaveBeenCalled();
    });

    it('tracks unsaved changes until a successful save', async () => {
      const component = await setup('program-1');
      expect(component.hasUnsavedChanges()).toBe(false);
      component.form.controls.title.setValue('Changed');
      component.form.markAsDirty();
      expect(component.hasUnsavedChanges()).toBe(true);
      await component.onSubmit();
      expect(component.hasUnsavedChanges()).toBe(false);
    });

    it('re-enables the publish button after a failed save', async () => {
      const component = await setup('program-1');
      store.saveProgram = vi.fn().mockRejectedValue(new Error('500'));
      await component.onSubmit();
      fixture.detectChanges();
      expect(component.submitting()).toBe(false);
      const submit = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement;
      expect(submit.disabled).toBe(false);
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
    it('adds key points up to the six the list holds', async () => {
      const component = await setup('program-1');
      for (let i = 0; i < 5; i++) component.addRow('keyPoints');

      expect(component.form.controls.keyPoints.length).toBe(6);
      expect(component.canAdd('keyPoints')).toBe(false);
    });

    it('never removes the last row of a list', async () => {
      const component = await setup('program-1');
      component.removeAt('aboutParagraphs', 0);
      component.removeAt('aboutParagraphs', 0);

      expect(component.form.controls.aboutParagraphs.length).toBe(1);
      expect(component.canRemove('aboutParagraphs')).toBe(false);
    });

    it('removes a row when more than one exists', async () => {
      const component = await setup('program-1');
      component.addRow('aboutParagraphs');
      component.removeAt('aboutParagraphs', 0);

      expect(component.form.controls.aboutParagraphs.getRawValue()).toEqual([
        program.aboutParagraphs[1],
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
      expect(value.badgeText).toBe('ALL REGIONS');
      expect(value.aboutParagraphs).toEqual(['']);
      expect(value.keyPoints).toEqual(['']);
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

    it('creates the program with its slug and confirms it', async () => {
      const component = await setup(null);
      const body = createBodyOf(makeProgram({ slug: 'new-program', keyPoints: ['One point'] }));
      component.patchFromProgram(body);
      component.slugControl.setValue('new-program');

      await component.onSubmit();

      expect(store.createProgram).toHaveBeenCalledWith(body);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
        'Program Created & Published',
      );
    });

    it('counts a typed slug as an unsaved change', async () => {
      const component = await setup(null);
      component.slugControl.setValue('draft');
      component.slugControl.markAsDirty();
      expect(component.hasUnsavedChanges()).toBe(true);
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

  describe('section navigation (one topic of the detail page at a time)', () => {
    const tabs = (): HTMLElement[] =>
      Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));
    const visiblePanels = (): HTMLElement[] =>
      Array.from(fixture.nativeElement.querySelectorAll('[role="tabpanel"]')).filter(
        (p) => !(p as HTMLElement).hidden,
      ) as HTMLElement[];

    it('renders an accessible tab list with one visible panel', async () => {
      await setup('program-1');
      fixture.detectChanges();
      const list = fixture.nativeElement.querySelector('[role="tablist"]');
      expect(list.getAttribute('aria-label')).toBe('Program sections');
      expect(tabs().map((t) => t.textContent?.trim().split('\n')[0].trim())).toEqual([
        'Program card',
        'About this program',
        'Key points & strategy',
      ]);
      expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
      expect(tabs()[1].getAttribute('tabindex')).toBe('-1');
      expect(visiblePanels().length).toBe(1);
      expect(visiblePanels()[0].getAttribute('aria-labelledby')).toBe(tabs()[0].id);
    });

    it('switches section on click and with arrow keys', async () => {
      await setup('program-1');
      fixture.detectChanges();
      tabs()[1].click();
      fixture.detectChanges();
      expect(visiblePanels()[0].textContent).toContain('About this program');

      tabs()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      fixture.detectChanges();
      expect(tabs()[2].getAttribute('aria-selected')).toBe('true');
      expect(document.activeElement).toBe(tabs()[2]);

      tabs()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      fixture.detectChanges();
      expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    });

    it('explains where each section appears on the public site', async () => {
      await setup('program-1');
      fixture.detectChanges();
      expect(visiblePanels()[0].textContent).toContain('program cards on the Programs page');
    });

    it('jumps to the first section with errors on a blocked publish and counts them', async () => {
      const component = await setup('program-1');
      component.form.controls.keyPoints.at(0).setValue('');
      await component.onSubmit();
      fixture.detectChanges();

      expect(tabs()[2].getAttribute('aria-selected')).toBe('true');
      expect(tabs()[2].textContent).toContain('1 error');
      expect(tabs()[0].textContent).not.toContain('error');
    });

    it('offers a next-section step at the end of each panel', async () => {
      await setup('program-1');
      fixture.detectChanges();
      const next = visiblePanels()[0].querySelector(
        '[data-testid="next-section"]',
      ) as HTMLButtonElement;
      expect(next.textContent).toContain('About this program');
      next.click();
      fixture.detectChanges();
      expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
    });
  });
});
