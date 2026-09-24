import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProgramPillar } from '../../models/program';
import { PILLAR_ICONS, PillarIconKey } from '../../models/pillar-icons';

const ICON_KEY_BY_EMOJI: Record<string, PillarIconKey> = Object.fromEntries(
  PILLAR_ICONS.map((icon) => [icon.emoji, icon.key]),
);

/** "Codified Operational Pillars" — 3-column governance architecture section. */
@Component({
  selector: 'app-operational-pillars',
  standalone: true,
  templateUrl: './operational-pillars.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationalPillars {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) heading = '';
  @Input({ required: true }) description = '';
  @Input({ required: true }) pillars: ProgramPillar[] = [];

  iconKey(pillar: ProgramPillar): PillarIconKey {
    return ICON_KEY_BY_EMOJI[pillar.icon] ?? 'shield';
  }
}
