import { getProperty } from './object';

describe('object helper', () => {
  describe('getProperty', () => {
    it('should return the object property', () => {
      expect(getProperty({ a: { b: { c: 42 } } }, 'a')).toEqual({
        b: { c: 42 },
      });
      expect(getProperty({ a: { b: { c: 42 } } }, 'a.b')).toEqual({ c: 42 });
      expect(getProperty({ a: { b: { c: 42 } } }, 'a.b.c')).toEqual(42);
      expect(getProperty({ a: { b: { c: 0 } } }, 'a.b.c')).toEqual(0);
      expect(getProperty({ a: { b: { c: null } } }, 'a.b.c')).toEqual(null);
    });

    it('should not return the object property', () => {
      expect(getProperty({ a: { b: { c: 42 } } }, '')).toEqual(undefined);
      expect(getProperty({ a: { b: { c: 42 } } }, 'b')).toEqual(undefined);
      expect(getProperty({ a: { b: { c: 42 } } }, 'a.c')).toEqual(undefined);
      expect(getProperty({ a: { b: { c: 42 } } }, 'a.c.d')).toEqual(undefined);
      expect(getProperty({ a: { b: { c: 42 } } }, 'a.b.c.d')).toEqual(
        undefined,
      );
    });
  });
});
