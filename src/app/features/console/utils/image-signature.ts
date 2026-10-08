export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

const HEADER_BYTES = 12;

const startsWith = (head: Uint8Array, bytes: number[], offset = 0) =>
  bytes.every((byte, i) => head[offset + i] === byte);
const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

/**
 * Identifies an image by its first bytes, not its name or browser-reported
 * MIME type (both trivially spoofed), so a renamed SVG, HTML file or
 * executable is caught before upload. Cloudinary re-validates the format;
 * this just fails fast with a useful message.
 */
export async function sniffImageFormat(file: File): Promise<ImageFormat | null> {
  if (file.size < HEADER_BYTES) return null;
  const head = new Uint8Array(await file.slice(0, HEADER_BYTES).arrayBuffer());
  if (startsWith(head, [0xff, 0xd8, 0xff])) return 'jpeg';
  if (startsWith(head, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png';
  if (startsWith(head, ascii('RIFF')) && startsWith(head, ascii('WEBP'), 8)) return 'webp';
  if (startsWith(head, ascii('ftypavif'), 4) || startsWith(head, ascii('ftypavis'), 4)) {
    return 'avif';
  }
  return null;
}
