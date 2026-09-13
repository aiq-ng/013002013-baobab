import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Eyebrow } from '../../../../shared/ui/eyebrow/eyebrow';

interface Track {
  eyebrow: string;
  title: string;
  description: string;
  capabilities: string[];
  limitations: string[];
  operatingSphereLabel: string;
  operatingSphere: string;
  emphasized: boolean;
}

/** "Sovereignty Matrix" 3-column Track 1 / Track 1.5 pivot / Track 2 model. */
@Component({
  selector: 'app-track-model',
  standalone: true,
  imports: [Eyebrow],
  templateUrl: './track-model.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackModel {
  readonly tracks: Track[] = [
    {
      eyebrow: 'TRACK 1',
      title: 'Intergovernmental Statecraft',
      description:
        'Official bilateral treaties, ministerial communiqués, regional body mandates (ECOWAS, AU), and uniformed defense pacts.',
      capabilities: [
        'Binding constitutional ratification',
        'National budget and territory allocation',
      ],
      limitations: ['Restricted from non-state armed contact', 'Protracted bureaucratic timelines'],
      operatingSphereLabel: 'OPERATING SPHERE',
      operatingSphere: 'Heads of State • Defence Staff',
      emphasized: false,
    },
    {
      eyebrow: 'TRACK 1.5 • THE BAOBAB PIVOT',
      title: 'Confidential Sovereign Conciliation',
      description:
        'The living bridge. Informal, unrecorded diplomatic backchannels authorized by sovereigns to convene customary elders with rebel and pastoral commanders.',
      capabilities: [
        'Denial-safe exploratory peace accords',
        'Customary blood-pact and covenant mediation',
        'Rapid 48-hour border ceasefire conduit',
        'Translates elder oaths into ministerial protocols',
      ],
      limitations: [],
      operatingSphereLabel: 'THE BAOBAB TRUST MANDATE',
      operatingSphere: 'Special Envoys • High Council',
      emphasized: true,
    },
    {
      eyebrow: 'TRACK 2',
      title: 'Grassroots Palaver & Clans',
      description:
        'Village palaver assemblies, transhumance pastoralist unions, sultanate councils, youth militias, and localized civic actors.',
      capabilities: [
        'Unrivaled community moral legitimacy',
        'Grassroots pastoral water access pacts',
      ],
      limitations: [
        'Vulnerable to state military overrides',
        'Zero formal sovereign legal enforceability',
      ],
      operatingSphereLabel: 'OPERATING SPHERE',
      operatingSphere: 'Sultans • Clan Chiefs • Youth Leaders',
      emphasized: false,
    },
  ];
}
