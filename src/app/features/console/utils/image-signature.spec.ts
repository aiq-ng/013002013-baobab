import { sniffImageFormat } from './image-signature';

function file(bytes: number[], name = 'a.jpg', type = 'image/jpeg'): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

describe('sniffImageFormat', () => {
  it('recognises JPEG, PNG, WebP and AVIF by their magic bytes', async () => {
    expect(await sniffImageFormat(file([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]))).toBe(
      'jpeg',
    );
    expect(
      await sniffImageFormat(file([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])),
    ).toBe('png');
    expect(await sniffImageFormat(file([...ascii('RIFF'), 1, 2, 3, 4, ...ascii('WEBP')]))).toBe(
      'webp',
    );
    expect(await sniffImageFormat(file([0, 0, 0, 0x1c, ...ascii('ftypavif')]))).toBe('avif');
  });

  it('rejects a renamed non-image even when the name and MIME type claim an image', async () => {
    expect(await sniffImageFormat(file(ascii('<svg onload=alert(1)>'), 'x.png', 'image/png'))).toBe(
      null,
    );
  });

  it('rejects SVG, GIF and HEIC, which the site does not accept', async () => {
    expect(await sniffImageFormat(file(ascii('GIF89a......')))).toBe(null);
    expect(await sniffImageFormat(file([0, 0, 0, 0x18, ...ascii('ftypheic')]))).toBe(null);
  });

  it('rejects an empty or truncated file', async () => {
    expect(await sniffImageFormat(file([]))).toBe(null);
    expect(await sniffImageFormat(file([0xff, 0xd8]))).toBe(null);
  });
});
