import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { AboutHero } from './components/hero/hero';
import { DocumentaryVideo } from './components/documentary-video/documentary-video';
import { MissionVisionPanel } from './components/mission-vision-panel/mission-vision-panel';
import { TheaterSection } from './components/theater-section/theater-section';
import { LogoStrip } from '../../shared/ui/logo-strip/logo-strip';
import { Eyebrow } from '../../shared/ui/eyebrow/eyebrow';
import { ProgramGrid, ProgramPreview } from '../../shared/ui/program-grid/program-grid';
import { SeoService } from '../../core/services/seo.service';
import { ProgramsService } from '../programs/services/programs.service';
import { PARTNER_LOGOS } from '../../shared/data/partner-logos.data';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    AboutHero,
    DocumentaryVideo,
    MissionVisionPanel,
    LogoStrip,
    Eyebrow,
    ProgramGrid,
    TheaterSection,
    ScrollRevealDirective,
  ],
  templateUrl: './about.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly programsService = inject(ProgramsService);

  readonly partnerLogos = PARTNER_LOGOS;
  readonly programsUnavailable = computed(
    () => this.programsService.status() === 'error' && this.programsService.programs().length === 0,
  );

  readonly activePrograms = computed<ProgramPreview[]>(() =>
    this.programsService.programs().map((program) => ({
      slug: program.slug,
      badgeText: program.badgeText,
      imageUrl: program.imageUrl,
      imageAlt: program.imageAlt,
      title: program.title,
      description: program.description,
    })),
  );

  ngOnInit(): void {
    this.seo.update({
      title: 'About Us',
      description:
        'The Baobab Group is an independent Track 1.5 sovereign advisory and peacecraft institute convening confidential dialogue across the Sahel and West Africa.',
    });
    void this.programsService.load();
  }
}
