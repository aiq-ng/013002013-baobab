import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';

/** "Know About Us" mission block with the ancestral-sanctuary portrait and doctrine download. */
@Component({
  selector: 'app-mission-block',
  standalone: true,
  imports: [Eyebrow, NgOptimizedImage],
  templateUrl: './mission-block.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionBlock {}
