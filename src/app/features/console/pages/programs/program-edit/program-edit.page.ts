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
import {
  ProgramContent,
  ProgramMilestone,
  ProgramPillar,
  ProgramStat,
} from '../../../../programs/models/program';
import { PILLAR_ICONS } from '../../../../programs/models/pillar-icons';

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
  kpis: { min: 1, max: 4 },
  doctrineParagraphs: { min: 1, max: 6 },
  doctrineStats: { min: 1, max: 3 },
  pillars: { min: 1, max: 3 },
  milestones: { min: 1, max: 12 },
} as const;
type ListName = keyof typeof LIST_LIMITS;

/** At most 4 comma-separated tags of up to 100 characters each. */
const tagsValidator: ValidatorFn = (control) => {
  const tags = splitTags(control.value as string);
  return tags.length > 4 || tags.some((tag) => tag.length > 100) ? { tags: true } : null;
};

function splitTags(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

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

type StatGroup = FormGroup<{
  value: FormControl<string>;
  unit: FormControl<string>;
  label: FormControl<string>;
}>;
type PillarGroup = FormGroup<{
  icon: FormControl<string>;
  eyebrow: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  footnote: FormControl<string>;
}>;
type MilestoneGroup = FormGroup<{
  date: FormControl<string>;
  kicker: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  tags: FormControl<string>;
}>;

const PILLAR_NUMERALS = ['I', 'II', 'III'];

export type SectionId = 'card' | 'header' | 'doctrine' | 'pillars' | 'timeline' | 'dispatch';

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
 * The detail page's ~40 fields, grouped by where they appear publicly so the
 * editor only faces one topic at a time (progressive disclosure).
 */
const SECTIONS: SectionDef[] = [
  {
    id: 'card',
    label: 'Program card',
    heading: 'Program card',
    description: 'Shown on program cards on the Programs and About pages.',
    controls: ['title', 'description', 'badgeText', 'theater', 'imageUrl', 'imageAlt'],
  },
  {
    id: 'header',
    label: 'Page header & KPIs',
    heading: 'Page header & KPIs',
    description:
      "The top of this program's detail page: its subtitle, reference metadata and headline figures.",
    controls: ['subtitle', 'referenceCode', 'clearanceLevel', 'statusTag', 'kpis'],
  },
  {
    id: 'doctrine',
    label: 'Doctrine',
    heading: 'Operational doctrine',
    description: 'The narrative section of the detail page, with its image and supporting figures.',
    controls: [
      'doctrineEyebrow',
      'doctrineHeading',
      'doctrineParagraphs',
      'doctrineImageUrl',
      'doctrineImageCaption',
      'doctrineStats',
    ],
  },
  {
    id: 'pillars',
    label: 'Pillars',
    heading: 'Operational pillars',
    description: 'Up to three pillar cards on the detail page.',
    controls: ['pillarsEyebrow', 'pillarsHeading', 'pillarsDescription', 'pillars'],
  },
  {
    id: 'timeline',
    label: 'Timeline',
    heading: 'Accord timeline',
    description: 'Dated milestones in the accord timeline on the detail page.',
    controls: ['timelineEyebrow', 'timelineHeading', 'timelineDescription', 'milestones'],
  },
  {
    id: 'dispatch',
    label: 'Dispatch form',
    heading: 'Confidential dispatch form',
    description: 'The confidential dispatch sign-up at the foot of the detail page.',
    controls: ['dispatchHeading', 'dispatchSubtext'],
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
 * below follow the same console form pattern). The slug is only editable at
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

  readonly pillarIcons = PILLAR_ICONS;
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
    theater: ['', SHORT],
    badgeText: ['', SHORT],

    referenceCode: ['', SHORT],
    clearanceLevel: ['', SHORT],
    statusTag: ['', SHORT],
    subtitle: ['', LONG],
    kpis: this.fb.array<StatGroup>([this.statGroup()]),

    doctrineEyebrow: ['STRATEGIC OPERATIONAL DOCTRINE', SHORT],
    doctrineHeading: ['', SHORT],
    doctrineParagraphs: this.fb.array<FormControl<string>>([this.fb.control('', LONG)]),
    doctrineImageUrl: ['', IMAGE_URL],
    doctrineImageCaption: ['', SHORT],
    doctrineStats: this.fb.array<StatGroup>([this.statGroup()]),

    pillarsEyebrow: ['GOVERNANCE ARCHITECTURE', SHORT],
    pillarsHeading: ['Codified Operational Pillars', SHORT],
    pillarsDescription: ['', LONG],
    pillars: this.fb.array<PillarGroup>([this.pillarGroup(0)]),

    timelineEyebrow: ['ACCORD TIMELINE', SHORT],
    timelineHeading: ['Verified Accord Milestones & Field Chronicle', SHORT],
    timelineDescription: ['', LONG],
    milestones: this.fb.array<MilestoneGroup>([this.milestoneGroup()]),

    dispatchHeading: ['', SHORT],
    dispatchSubtext: ['', LONG],
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

  pillarSummary(index: number): string {
    return this.form.controls.pillars.at(index).controls.title.value;
  }

  milestoneSummary(index: number): string {
    const { date, title } = this.form.controls.milestones.at(index).controls;
    return [date.value, title.value].filter(Boolean).join(' · ');
  }

  statSummary(list: 'kpis' | 'doctrineStats', index: number): string {
    const { value, unit, label } = this.form.controls[list].at(index).controls;
    return [value.value, unit.value, label.value].filter(Boolean).join(' ');
  }

  paragraphSummary(index: number): string {
    const text = this.form.controls.doctrineParagraphs.at(index).value;
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
    this.resize(controls.kpis, content.kpis.length, () => this.statGroup());
    this.resize(controls.doctrineParagraphs, content.doctrineParagraphs.length, () =>
      this.fb.control('', LONG),
    );
    this.resize(controls.doctrineStats, content.doctrineStats.length, () => this.statGroup());
    this.resize(controls.pillars, content.pillars.length, (i) => this.pillarGroup(i));
    this.resize(controls.milestones, content.milestones.length, () => this.milestoneGroup());

    this.form.setValue({
      title: content.title,
      description: content.description,
      imageUrl: content.imageUrl,
      imageAlt: content.imageAlt,
      theater: content.theater,
      badgeText: content.badgeText,
      referenceCode: content.referenceCode,
      clearanceLevel: content.clearanceLevel,
      statusTag: content.statusTag,
      subtitle: content.subtitle,
      kpis: content.kpis.map(toStatValue),
      doctrineEyebrow: content.doctrineEyebrow,
      doctrineHeading: content.doctrineHeading,
      doctrineParagraphs: [...content.doctrineParagraphs],
      doctrineImageUrl: content.doctrineImageUrl,
      doctrineImageCaption: content.doctrineImageCaption,
      doctrineStats: content.doctrineStats.map(toStatValue),
      pillarsEyebrow: content.pillarsEyebrow,
      pillarsHeading: content.pillarsHeading,
      pillarsDescription: content.pillarsDescription,
      pillars: content.pillars.map((pillar) => ({ ...pillar })),
      timelineEyebrow: content.timelineEyebrow,
      timelineHeading: content.timelineHeading,
      timelineDescription: content.timelineDescription,
      milestones: content.milestones.map((m) => ({ ...m, tags: m.tags.join(', ') })),
      dispatchHeading: content.dispatchHeading,
      dispatchSubtext: content.dispatchSubtext,
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

  addKpi(): void {
    if (this.canAdd('kpis')) this.form.controls.kpis.push(this.statGroup());
  }

  addDoctrineStat(): void {
    if (this.canAdd('doctrineStats')) this.form.controls.doctrineStats.push(this.statGroup());
  }

  addParagraph(): void {
    if (this.canAdd('doctrineParagraphs')) {
      this.form.controls.doctrineParagraphs.push(this.fb.control('', LONG));
    }
  }

  addPillar(): void {
    const pillars = this.form.controls.pillars;
    if (this.canAdd('pillars')) pillars.push(this.pillarGroup(pillars.length));
  }

  addMilestone(): void {
    if (this.canAdd('milestones')) this.form.controls.milestones.push(this.milestoneGroup());
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
    const value = trimStrings(this.form.getRawValue());
    return {
      ...value,
      kpis: value.kpis.map(fromStatValue),
      doctrineStats: value.doctrineStats.map(fromStatValue),
      pillars: value.pillars.map((pillar): ProgramPillar => ({ ...pillar })),
      milestones: value.milestones.map((m): ProgramMilestone => ({
        ...m,
        tags: splitTags(m.tags),
      })),
    };
  }

  // --- row factories ------------------------------------------------------

  private statGroup(): StatGroup {
    return this.fb.group({
      value: ['', [Validators.required, Validators.maxLength(50)]],
      unit: ['', [Validators.maxLength(50)]],
      label: ['', SHORT],
    });
  }

  private pillarGroup(index: number): PillarGroup {
    return this.fb.group({
      icon: [PILLAR_ICONS[index % PILLAR_ICONS.length].emoji, Validators.required],
      eyebrow: [`PILLAR ${PILLAR_NUMERALS[index] ?? index + 1}`, SHORT],
      title: ['', SHORT],
      description: ['', LONG],
      footnote: ['', SHORT],
    });
  }

  private milestoneGroup(): MilestoneGroup {
    return this.fb.group({
      date: ['', SHORT],
      kicker: ['', SHORT],
      title: ['', SHORT],
      description: ['', LONG],
      tags: ['', tagsValidator],
    });
  }

  private resize<T extends FormArray>(
    array: T,
    length: number,
    make: (index: number) => T['controls'][number],
  ): void {
    while (array.length > length) array.removeAt(array.length - 1);
    while (array.length < length) array.push(make(array.length));
  }
}

function toStatValue(stat: ProgramStat): { value: string; unit: string; label: string } {
  return { value: stat.value, unit: stat.unit ?? '', label: stat.label };
}

function fromStatValue(stat: { value: string; unit: string; label: string }): ProgramStat {
  const unit = stat.unit.trim();
  return { value: stat.value, unit: unit.length > 0 ? unit : null, label: stat.label };
}
