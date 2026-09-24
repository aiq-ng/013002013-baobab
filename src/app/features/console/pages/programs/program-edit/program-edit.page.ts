import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService } from '../../../../../core/services/seo.service';
import { ToastService } from '../../../../../shared/ui/toast/toast.service';
import { Button } from '../../../../../shared/ui/button/button';
import { ConsoleStore } from '../../../services/console-store';
import { ConsoleField } from '../../../components/console-field/console-field';
import {
  ProgramContent,
  ProgramMilestone,
  ProgramPillar,
  ProgramStat,
} from '../../../../programs/models/program';
import { PILLAR_ICONS } from '../../../../programs/models/pillar-icons';

// Mirrors the backend's ProgramContent limits (app/schemas/content.py).
const SHORT = [Validators.required, Validators.maxLength(200)];
const LONG = [Validators.required, Validators.maxLength(2000)];
const IMAGE_URL = [
  Validators.required,
  Validators.maxLength(500),
  Validators.pattern(/^(\/[^/]|https:\/\/).*/),
];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

/**
 * Create or edit a program — every field its public `programs/:slug` page
 * renders (PROGRAMS EDIT.png covers the card fields; the detail sections
 * below follow the same console form pattern). The slug is only editable at
 * creation, since it is the program's public URL.
 */
@Component({
  selector: 'app-console-program-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Button, ConsoleField],
  templateUrl: './program-edit.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramEditPage implements OnInit {
  private readonly store = inject(ConsoleStore);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly destroyRef = inject(DestroyRef);

  readonly pillarIcons = PILLAR_ICONS;
  readonly limits = LIST_LIMITS;

  readonly slug = this.route.snapshot.paramMap.get('slug');
  readonly isNew = this.slug === null;

  readonly programs = this.store.programs;
  readonly program = computed(() => this.programs().find((p) => p.slug === this.slug) ?? null);
  readonly notFound = signal(false);

  readonly slugControl = this.fb.control('', [
    Validators.required,
    Validators.maxLength(100),
    Validators.pattern(SLUG_PATTERN),
  ]);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(600)]],
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

  submitting = false;

  ngOnInit(): void {
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

  private async load(): Promise<void> {
    if (this.programs().length === 0) {
      try {
        await this.store.loadPrograms();
      } catch {
        this.toast.error('Could not load the program.');
        return;
      }
    }
    const program = this.program();
    if (program) {
      this.patchFromProgram(program);
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
    if (this.form.invalid || (this.isNew && this.slugControl.invalid)) {
      this.form.markAllAsTouched();
      this.slugControl.markAsTouched();
      this.toast.error('Some fields need attention.');
      return;
    }
    const content = this.toContent();
    this.submitting = true;
    try {
      if (this.isNew) {
        await this.store.createProgram({ slug: this.slugControl.value, ...content });
        this.toast.success('Program created and published.');
      } else {
        await this.store.saveProgram(this.slug as string, content);
        this.toast.success('Program updated.');
      }
      await this.router.navigate(['/console/programs']);
    } catch (error) {
      this.toast.error(
        error instanceof HttpErrorResponse && error.status === 409
          ? 'A program with this slug already exists.'
          : 'Could not save the program.',
      );
    } finally {
      this.submitting = false;
    }
  }

  private toContent(): ProgramContent {
    const value = this.form.getRawValue();
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
