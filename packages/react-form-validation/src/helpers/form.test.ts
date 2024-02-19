import { getFormInputs, insertInMapSet } from './form';

describe('form helper', () => {
  describe('getFormInputs', () => {
    it('should get the form inputs', () => {
      const form = document.createElement('form');
      const input1 = document.createElement('input');
      input1.setAttribute('name', 'foo');
      input1.setAttribute('value', '');
      form.appendChild(input1);
      const input2 = document.createElement('input');
      input2.setAttribute('value', '');
      form.appendChild(input2);
      const input3 = document.createElement('input');
      input3.setAttribute('name', 'foo');
      input3.setAttribute('type', 'submit');
      form.appendChild(input2);
      expect(getFormInputs(form)).toEqual([input1]);
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
