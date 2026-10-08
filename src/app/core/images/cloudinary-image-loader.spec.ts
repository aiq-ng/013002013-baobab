import { cloudinaryImageLoader } from './cloudinary-image-loader';

const UPLOADED = 'https://res.cloudinary.com/demo/image/upload/v17/baobab/programs/a.jpg';

describe('cloudinaryImageLoader', () => {
  it('asks Cloudinary for the best format and quality at the requested width', () => {
    expect(cloudinaryImageLoader({ src: UPLOADED, width: 640 })).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_640/v17/baobab/programs/a.jpg',
    );
  });

  it('still optimises format and quality when no width is requested', () => {
    expect(cloudinaryImageLoader({ src: UPLOADED })).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v17/baobab/programs/a.jpg',
    );
  });

  it('leaves site paths and other hosts untouched', () => {
    expect(cloudinaryImageLoader({ src: '/images/home/a.jpg', width: 640 })).toBe(
      '/images/home/a.jpg',
    );
    expect(cloudinaryImageLoader({ src: 'https://images.example.org/a.jpg', width: 640 })).toBe(
      'https://images.example.org/a.jpg',
    );
  });

  it('does not stack a second transformation onto an already-transformed URL', () => {
    const transformed = 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1/x.jpg';
    expect(cloudinaryImageLoader({ src: transformed, width: 320 })).toBe(transformed);
  });
});
