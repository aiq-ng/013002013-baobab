import { ArchiveEntry, ProtectionItem } from '../models/resource';

/**
 * The Treaties & Conciliation Archive listing. `category` drives the
 * All Accords / Transhumance / Riparian & Water filter pills.
 */
export const ARCHIVE_ENTRIES: ArchiveEntry[] = [
  {
    refCode: 'REF: BBG-LQ-2023-TRX',
    regionTag: 'Sahel Central Basin',
    statusTag: 'Ratified: November 2023 · In Active Force',
    title: 'Liptako-Gourma Tri-Border Accord & Customary Grazing Charter',
    description:
      'Tripartite non-aggression and dry-season corridor demarcations between pastoral federations and agrarian canton councils across the border triangle of Mali, Niger, and Burkina Faso.',
    ratifyingParties: 'Delegations of Mali, Niger, Burkina Faso, Liptako Traditional Chiefs',
    workingLanguages: 'Français, Hausa, Fulfulde, Tamasheq',
    category: 'Transhumance',
  },
  {
    refCode: 'REF: BBG-LCB-2024-RPW',
    regionTag: 'Lake Chad Basin Basin',
    statusTag: 'Ratified: March 2024 · Periodic Review',
    title: 'Lake Chad Riparian Fishery & Trans-Islet Water Protocol',
    description:
      'Multilateral customary governance resolving seasonal wetland boundary disputes between lakeside Kanuri fisherfolk, Shuwa Arab pastoralists, and border authorities in the quadripoint basin.',
    ratifyingParties: 'MNJTF Observers, Republic of Chad, Nigeria, Cameroon, Sultanate of Borno',
    workingLanguages: 'English, Français, Hausa, Kanuri, Arabic',
    category: 'Riparian & Water',
  },
  {
    refCode: 'REF: BBG-GLF-2024-LIT',
    regionTag: 'Gulf of Guinea Northern Rim',
    statusTag: 'Ratified: August 2024 · Institutionalized',
    title: 'Northern Littoral Early-Warning & Sovereign Buffer Protocol',
    description:
      'Cross-border mutual defense and intelligence-sharing architecture connecting coastal state ministries (Ghana, Togo, Benin, Côte d’Ivoire) with interior forest customary royalties.',
    ratifyingParties:
      'Accra Initiative Council, Chieftaincy Secretariats of Northern Ghana, Savanes Region Observers',
    workingLanguages: 'English, Français, Dagbani, Ewe, Baoulé',
    category: 'Transhumance',
  },
];

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
