import { intersection } from './array';

describe('array helper', () => {
  describe('intersection', () => {
    it('should return the intersection between two array2', () => {
      expect(intersection([1, 2, 3, 4], [2, 4])).toEqual([2, 4]);
      expect(intersection([1, 3], [1, 2, 3, 4])).toEqual([1, 3]);
      expect(intersection([1, 3], [2, 4])).toEqual([]);
    });
  });
});
