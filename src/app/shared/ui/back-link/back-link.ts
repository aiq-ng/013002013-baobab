import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Premium back-navigation link used at the top of detail pages (programs, FAQ). */
@Component({
  selector: 'app-back-link',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './back-link.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackLink {
  @Input({ required: true }) routerLink = '';
  @Input() label = 'Back';
}
