import { ProtectionItem } from '../models/resource';

/** The 3-item "Privacy & Sovereign Data Protections" summary grid. */
export const PROTECTION_ITEMS: ProtectionItem[] = [
  {
    icon: 'shield',
    tint: 'brand',
    title: 'Cryptographic Sovereignty',
    description:
      'All classified dispute submissions, GPS transit coordinate sets, and ceasefire transcripts are committed to air-gapped Hardware Security Modules (HSMs) physically located within sovereign diplomatic liaison hubs.',
    badge: 'Zero Cloud Foreign Exposure',
  },
  {
    icon: 'scales',
    tint: 'amber',
    title: 'Customary Inviolability',
    description:
      'Oral depositions and sacred elder conciliations are shielded under recognized customary African jurisprudence. Traditional testimony is legally insulated from weaponization or adversarial unilateral litigation.',
    badge: 'Sultanate Jurisprudential Shield',
  },
  {
    icon: 'eye-off',
    tint: 'slate',
    title: 'Strict Chatham House Accord',
    description:
      'Participants are entirely free to utilize received information to craft peace pacts, but neither the identity nor the specific ministerial affiliation of any speaker or delegate may be publicly disclosed.',
    badge: 'Total Non-Attribution Guarantee',
  },
];
