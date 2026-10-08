import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../../../../core/services/seo.service';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../../shared/ui/button/button';
import { ConsoleStore } from '../../../services/console-store';
import { ConsoleField } from '../../../components/console-field/console-field';
import { PageHeader } from '../../../components/page-header/page-header';
import { ImageField } from '../../../components/image-field/image-field';
import { RepeatItem } from '../../../components/repeat-item/repeat-item';
import { SuccessPanel } from '../../../components/success-panel/success-panel';
import { StatusPanel } from '../../../../../shared/ui/status-panel/status-panel';
import { consoleValidators } from '../../../validators/console-validators';
import { ConsoleFormPage, trimStrings } from '../../../utils/console-form-page';
import { describeApiError } from '../../../utils/api-error';
import { ProgramContent } from '../../../../programs/models/program';

// Mirrors the backend's ProgramContent limits (app/schemas/content.py).
const SHORT = [consoleValidators.notBlank, Validators.maxLength(200)];
const LONG = [consoleValidators.notBlank, Validators.maxLength(2000)];
const IMAGE_URL = [
  consoleValidators.notBlank,
  Validators.maxLength(500),
  consoleValidators.safeLink,
];

/** Row bounds per repeatable list — the detail page lays out at most these many. */
const LIST_LIMITS = {
  aboutParagraphs: { min: 1, max: 6 },
  keyPoints: { min: 1, max: 6 },
} as const;
type ListName = keyof typeof LIST_LIMITS;

/** Validators for one row of each list. */
const ROW_VALIDATORS: Record<ListName, ValidatorFn[]> = {
  aboutParagraphs: LONG,
  keyPoints: SHORT,
};

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
    .replace(/-+$/, '');
}

export type SectionId = 'card' | 'about' | 'strategy';

interface SectionDef {
  id: SectionId;
  /** Short name in the section list. */
  label: string;
  /** Panel heading. */
  heading: string;
  /** Where this content appears on the public site — orients the editor. */
  description: string;
  controls: string[];
}

/**
 * The detail page's fields, grouped by where they appear publicly so the
 * editor only faces one topic at a time (progressive disclosure).
 */
const SECTIONS: SectionDef[] = [
  {
    id: 'card',
    label: 'Program card',
    heading: 'Program card',
    description:
      'Shown on program cards on the Programs page, and as the header and photo of the detail page.',
    controls: ['title', 'description', 'badgeText', 'imageUrl', 'imageAlt'],
  },
  {
    id: 'about',
    label: 'About this program',
    heading: 'About this program',
    description: 'The "About this program:" text beside the program photo on the detail page.',
    controls: ['aboutParagraphs'],
  },
  {
    id: 'strategy',
    label: 'Key points & strategy',
    heading: 'Key points & strategy',
    description:
      'The key points list, "From our strategy" heading, expected impact and portrait on the detail page.',
    controls: [
      'keyPoints',
      'strategyHeading',
      'expectedImpact',
      'strategyImageUrl',
      'strategyImageAlt',
    ],
  },
];

function countInvalid(control: AbstractControl): number {
  if (control instanceof FormGroup || control instanceof FormArray) {
    return Object.values(control.controls).reduce<number>(
      (sum, child: AbstractControl) => sum + countInvalid(child),
      0,
    );
  }
  return control.invalid ? 1 : 0;
}

/**
 * Create or edit a program — every field its public `programs/:slug` page
 * renders (PROGRAMS EDIT.png covers the card fields; the detail sections
 * follow the same console form pattern). The slug is only editable at
 * creation, since it is the program's public URL.
 */
@Component({
  selector: 'app-console-program-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    Button,
    ConsoleField,
    ImageField,
    RepeatItem,
    PageHeader,
    SuccessPanel,
    StatusPanel,
  ],
  templateUrl: './program-edit.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramEditPage extends ConsoleFormPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly limits = LIST_LIMITS;

  readonly slug = this.route.snapshot.paramMap.get('slug');
  readonly isNew = this.slug === null;

  readonly programs = this.store.programs;
  readonly program = computed(() => this.programs().find((p) => p.slug === this.slug) ?? null);
  readonly notFound = signal(false);
  readonly loadError = signal<string | null>(null);
  /** Set after a successful publish — the page then shows the confirmation panel. */
  readonly published = signal<{ title: string; slug: string; created: boolean } | null>(null);

  readonly slugControl = this.fb.control('', [
    consoleValidators.notBlank,
    Validators.maxLength(100),
    consoleValidators.slug,
  ]);

  readonly form = this.fb.group({
    title: ['', [consoleValidators.notBlank, Validators.maxLength(120)]],
    description: ['', [consoleValidators.notBlank, Validators.maxLength(600)]],
    imageUrl: ['', IMAGE_URL],
    imageAlt: ['', SHORT],
    badgeText: ['ALL REGIONS', SHORT],

    aboutParagraphs: this.fb.array<FormControl<string>>([this.row('aboutParagraphs')]),

    keyPoints: this.fb.array<FormControl<string>>([this.row('keyPoints')]),
    strategyHeading: ['', SHORT],
    expectedImpact: ['', LONG],
    strategyImageUrl: ['', IMAGE_URL],
    strategyImageAlt: ['', SHORT],
  });

  protected get trackedForm() {
    return this.form;
  }

  // --- sections -----------------------------------------------------------

  readonly sections = SECTIONS;
  readonly activeSection = signal<SectionId>('card');
  /** Error counts only appear once a publish has been attempted. */
  readonly submitAttempted = signal(false);
  /** Bumped on every form event so the counts below stay live. */
  private readonly formVersion = signal(0);

  readonly errorCounts = computed<Record<SectionId, number>>(() => {
    this.formVersion();
    const counts = {} as Record<SectionId, number>;
    for (const section of SECTIONS) {
      let count = section.controls.reduce(
        (sum, name) => sum + countInvalid(this.form.get(name) as AbstractControl),
        0,
      );
      if (section.id === 'card' && this.isNew) count += countInvalid(this.slugControl);
      counts[section.id] = count;
    }
    return counts;
  });

  selectSection(id: SectionId): void {
    this.activeSection.set(id);
  }

  nextSection(id: SectionId): SectionDef | null {
    const index = SECTIONS.findIndex((s) => s.id === id);
    return SECTIONS[index + 1] ?? null;
  }

  goToNextSection(id: SectionId): void {
    const next = this.nextSection(id);
    if (next) {
      this.activeSection.set(next.id);
      this.focusTab(next.id);
    }
  }

  /** WAI-ARIA tabs keyboard model: arrows move (and select), Home/End jump. */
  onTabKeydown(event: KeyboardEvent, index: number): void {
    const last = SECTIONS.length - 1;
    const target =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (target === null) return;
    event.preventDefault();
    this.activeSection.set(SECTIONS[target].id);
    this.focusTab(SECTIONS[target].id);
  }

  private focusTab(id: SectionId): void {
    this.hostEl.nativeElement.querySelector<HTMLElement>(`#section-tab-${id}`)?.focus();
  }

  paragraphSummary(index: number): string {
    const text = this.form.controls.aboutParagraphs.at(index).value;
    return text.length > 60 ? `${text.slice(0, 60).trimEnd()}…` : text;
  }

  override hasUnsavedChanges(): boolean {
    return this.form.dirty || (this.isNew && this.slugControl.dirty);
  }

  ngOnInit(): void {
    for (const control of [this.form, this.slugControl]) {
      control.events
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.formVersion.update((v) => v + 1));
    }
    this.seo.update({
      title: this.isNew ? 'New program' : 'Edit program',
      description: 'Manage a Secretariat program record.',
      noIndex: true,
    });

    if (this.isNew) {
      this.form.controls.title.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((title) => {
          if (!this.slugControl.dirty) {
            this.slugControl.setValue(slugify(title));
          }
        });
      return;
    }
    void this.load();
  }

  async load(): Promise<void> {
    this.loadError.set(null);
    if (this.programs().length === 0) {
      try {
        await this.store.loadPrograms();
      } catch (error) {
        this.loadError.set(describeApiError(error, 'Could not load the program.'));
        return;
      }
    }
    const program = this.program();
    if (program) {
      this.patchFromProgram(program);
      this.form.markAsPristine();
    } else {
      this.notFound.set(true);
    }
  }

  /** Resizes every list to match `content`, then fills the form from it. */
  patchFromProgram(content: ProgramContent): void {
    const { controls } = this.form;
    this.resize(controls.aboutParagraphs, content.aboutParagraphs.length, 'aboutParagraphs');
    this.resize(controls.keyPoints, content.keyPoints.length, 'keyPoints');

    this.form.setValue({
      title: content.title,
      description: content.description,
      imageUrl: content.imageUrl,
      imageAlt: content.imageAlt,
      badgeText: content.badgeText,
      aboutParagraphs: [...content.aboutParagraphs],
      keyPoints: [...content.keyPoints],
      strategyHeading: content.strategyHeading,
      expectedImpact: content.expectedImpact,
      strategyImageUrl: content.strategyImageUrl,
      strategyImageAlt: content.strategyImageAlt,
    });
  }

  // --- repeatable lists ---------------------------------------------------

  canAdd(list: ListName): boolean {
    return this.form.controls[list].length < LIST_LIMITS[list].max;
  }

  canRemove(list: ListName): boolean {
    return this.form.controls[list].length > LIST_LIMITS[list].min;
  }

  removeAt(list: ListName, index: number): void {
    if (this.canRemove(list)) {
      this.form.controls[list].removeAt(index);
    }
  }

  addRow(list: ListName): void {
    if (this.canAdd(list)) this.form.controls[list].push(this.row(list));
  }

  // --- submit -------------------------------------------------------------

  async onSubmit(): Promise<void> {
    if (this.submitting()) return;
    if (this.form.invalid || (this.isNew && this.slugControl.invalid)) {
      this.submitAttempted.set(true);
      const counts = this.errorCounts();
      const firstWithErrors = SECTIONS.find((section) => counts[section.id] > 0);
      if (firstWithErrors) this.activeSection.set(firstWithErrors.id);
      this.rejectInvalid(this.slugControl);
      this.toast.error('Some fields need attention.');
      return;
    }
    const content = this.toContent();
    const slug = this.isNew ? this.slugControl.value.trim() : (this.slug as string);
    try {
      await this.guardedSave(async () => {
        if (this.isNew) {
          await this.store.createProgram({ slug, ...content });
        } else {
          await this.store.saveProgram(slug, content);
        }
      });
      this.slugControl.markAsPristine();
      this.published.set({ title: content.title, slug, created: this.isNew });
    } catch (error) {
      this.toast.error(
        error instanceof HttpErrorResponse && error.status === 409
          ? 'A program with this slug already exists.'
          : describeApiError(error, 'Could not save the program.'),
      );
    }
  }

  /** "Edit this program again" — back to the form, now showing the saved values. */
  editAgain(): void {
    this.published.set(null);
  }

  private toContent(): ProgramContent {
    return trimStrings(this.form.getRawValue());
  }

  // --- row factories ------------------------------------------------------

  private row(list: ListName): FormControl<string> {
    return this.fb.control('', ROW_VALIDATORS[list]);
  }

  private resize(array: FormArray<FormControl<string>>, length: number, list: ListName): void {
    while (array.length > length) array.removeAt(array.length - 1);
    while (array.length < length) array.push(this.row(list));
  }
}
