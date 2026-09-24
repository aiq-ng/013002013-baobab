const PDF_MAGIC = '%PDF-';

/**
 * Checks a file's first bytes, not its name or browser-reported MIME type
 * (both are trivially spoofed), so a renamed HTML or executable is caught
 * before upload. The server re-validates; this just fails fast.
 */
export async function hasPdfSignature(file: File): Promise<boolean> {
  if (file.size < PDF_MAGIC.length) return false;
  const head = new Uint8Array(await file.slice(0, PDF_MAGIC.length).arrayBuffer());
  return String.fromCharCode(...head) === PDF_MAGIC;
}
