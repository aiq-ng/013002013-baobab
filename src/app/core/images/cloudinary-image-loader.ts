import { ImageLoaderConfig } from '@angular/common';

// `…/image/upload/` followed directly by a version (`v123/`) or the public id —
// i.e. an untransformed delivery URL, as the console stores them.
const UNTRANSFORMED =
  /^(https:\/\/res\.cloudinary\.com\/[^/\s]+\/image\/upload\/)((?:v\d+\/)?[^,\s]+)$/;

/**
 * App-wide `NgOptimizedImage` loader. Images uploaded through the Registry
 * Console live on Cloudinary, which can resize and re-encode on the fly: those
 * get `f_auto,q_auto` (AVIF/WebP where the browser supports it, perceptual
 * quality) plus the width Angular asks for, so every `ngSrc` gets a real
 * responsive srcset. Site paths and other hosts are returned unchanged.
 */
export function cloudinaryImageLoader(config: ImageLoaderConfig): string {
  const match = UNTRANSFORMED.exec(config.src);
  if (!match) return config.src;
  const transformation = config.width ? `f_auto,q_auto,c_limit,w_${config.width}` : 'f_auto,q_auto';
  return `${match[1]}${transformation}/${match[2]}`;
}
