import { trimStrings } from './console-form-page';

describe('trimStrings', () => {
  it('trims strings at any depth and leaves other values alone', () => {
    expect(trimStrings({ a: '  x ', b: 3, c: [' y ', { z: ' z ' }], d: true, e: null })).toEqual({
      a: 'x',
      b: 3,
      c: ['y', { z: 'z' }],
      d: true,
      e: null,
    });
  });
});
