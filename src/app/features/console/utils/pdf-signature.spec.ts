import { hasPdfSignature } from './pdf-signature';

describe('hasPdfSignature', () => {
  it('accepts a file that starts with the %PDF- magic bytes', async () => {
    const file = new File(['%PDF-1.7\n…'], 'a.pdf', { type: 'application/pdf' });
    expect(await hasPdfSignature(file)).toBe(true);
  });

  it('rejects a renamed non-PDF even when the name and MIME type claim PDF', async () => {
    const file = new File(['<html><script>'], 'a.pdf', { type: 'application/pdf' });
    expect(await hasPdfSignature(file)).toBe(false);
  });

  it('rejects an empty file', async () => {
    expect(await hasPdfSignature(new File([], 'a.pdf'))).toBe(false);
  });
});
