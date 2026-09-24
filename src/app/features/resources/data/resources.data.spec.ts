import { PROTECTION_ITEMS } from './resources.data';

describe('resources.data', () => {
  it('has exactly 3 data protection items', () => {
    expect(PROTECTION_ITEMS).toHaveLength(3);
  });
});
