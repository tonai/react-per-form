import { areObjectEquals, filterObject, getProperty } from './object';

describe('object helper', () => {
  describe('areObjectEquals', () => {
    it('should check that objects are equals (first level)', () => {
      const ref = {};
      expect(areObjectEquals({ foo: 'bar' }, { foo: 'bar' })).toEqual(true);
      expect(
        areObjectEquals(
          { bar: 42, baz: ref, foo: null },
          { bar: 42, baz: ref, foo: null },
        ),
      ).toEqual(true);
      expect(
        areObjectEquals({ bar: undefined, foo: 'bar' }, { foo: 'bar' }),
      ).toEqual(true);
      expect(
        areObjectEquals({ foo: 'bar' }, { baz: undefined, foo: 'bar' }),
      ).toEqual(true);
    });

    it('should check that objects are not equals (first level)', () => {
      expect(areObjectEquals({ foo: 'bar' }, { foo: 'baz' })).toEqual(false);
      expect(
        areObjectEquals(
          { bar: 42, baz: {}, foo: 'bar' },
          { bar: 42, baz: {}, foo: 'bar' },
        ),
      ).toEqual(false);
      expect(areObjectEquals({ bar: '', foo: 'bar' }, { foo: 'bar' })).toEqual(
        false,
      );
      expect(areObjectEquals({ foo: 'bar' }, { baz: '', foo: 'bar' })).toEqual(
        false,
      );
    });

    it('should check that objects are equals (deep)', () => {
      expect(
        areObjectEquals(
          { bar: [42, 12], baz: { bar: undefined, foo: 'bar' }, foo: null },
          { bar: [42, 12], baz: { baz: undefined, foo: 'bar' }, foo: null },
          true,
        ),
      ).toEqual(true);
    });

    it('should check that objects are not equals (deep)', () => {
      expect(
        areObjectEquals(
          { bar: [42], baz: { bar: undefined, foo: 'bar' }, foo: null },
          { bar: [42, 12], baz: { baz: undefined, foo: 'bar' }, foo: null },
          true,
        ),
      ).toEqual(false);
      expect(
        areObjectEquals(
          { bar: [42, 12], baz: { bar: undefined, foo: '' }, foo: null },
          { bar: [42, 12], baz: { baz: undefined, foo: 'bar' }, foo: null },
          true,
        ),
      ).toEqual(false);
    });
  });

  describe('filterObject', () => {
    it('should filter the object', () => {
      expect(
        filterObject({ bar: 'bar', baz: 'baz', foo: 'foo' }, ([key]) =>
          key.includes('ba'),
        ),
      ).toEqual({ bar: 'bar', baz: 'baz' });
    });
  });

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
