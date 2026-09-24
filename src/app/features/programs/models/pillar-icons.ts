export type PillarIconKey =
  | 'clock'
  | 'handshake'
  | 'shield'
  | 'speech'
  | 'clipboard'
  | 'signal'
  | 'building'
  | 'calendar'
  | 'leaf';

/**
 * The pillar icons the detail page can draw. A pillar stores the emoji; the
 * page maps it to its line icon. The console offers exactly these options.
 */
export const PILLAR_ICONS: readonly { emoji: string; key: PillarIconKey; label: string }[] = [
  { emoji: '🕒', key: 'clock', label: 'Clock' },
  { emoji: '🤝', key: 'handshake', label: 'Handshake' },
  { emoji: '🛡️', key: 'shield', label: 'Shield' },
  { emoji: '🗣️', key: 'speech', label: 'Speech' },
  { emoji: '📋', key: 'clipboard', label: 'Clipboard' },
  { emoji: '📡', key: 'signal', label: 'Signal' },
  { emoji: '🏗️', key: 'building', label: 'Building' },
  { emoji: '🗓️', key: 'calendar', label: 'Calendar' },
  { emoji: '🌿', key: 'leaf', label: 'Leaf' },
];
