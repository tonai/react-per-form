import { getFormValidate, insertInMapSet } from './form';
import { createValidate } from './validator';

jest.mock('./validator', () => ({
  createValidate: jest.fn(),
}));

describe('form helper', () => {
  describe('getFormValidate', () => {
    it('should return the validate function', () => {
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.setAttribute('name', 'foo');
      form.appendChild(input);
      const setErrors = (): null => null;
      const validator = (): string => '';
      getFormValidate(form, ['foo'], true, setErrors, validator, {});
      expect(createValidate).toHaveBeenCalledWith(
        { foo: { current: input } },
        ['foo'],
        true,
        setErrors,
        validator,
        {},
      );
    });
  });

  describe('insertInMapSet', () => {
    it('should create a new set in map', () => {
      const map = new Map<string, Set<unknown>>();
      insertInMapSet(map, 'foo', 'bar');
      expect(map).toEqual(new Map([['foo', new Set(['bar'])]]));
    });

    it('should append in existing set in map', () => {
      const map = new Map<string, Set<unknown>>([['foo', new Set(['bar'])]]);
      insertInMapSet(map, 'foo', 'baz');
      expect(map).toEqual(new Map([['foo', new Set(['bar', 'baz'])]]));
    });
  });
});
