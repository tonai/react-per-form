import { getFormInputs, getValidatorMap, insertInMapSet } from './form';

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

  describe('getValidatorMap', () => {
    it('should add simple field validator', () => {
      const validatorMap = getValidatorMap(
        new Set([{ id: 'foo', names: ['foo'] }]),
      );
      expect(validatorMap).toEqual(
        new Map([['foo', new Set([{ id: 'foo', names: ['foo'] }])]]),
      );
    });

    it('should add simple form validator', () => {
      const validatorMap = getValidatorMap(new Set(), {
        bar: () => '',
        foo: { names: ['foo'], validator: () => '' },
      });
      expect(validatorMap).toEqual(
        new Map([
          [
            'foo',
            new Set([
              {
                id: 'foo',
                messages: undefined,
                names: ['foo'],
                validator: expect.any(Function) as () => void,
              },
            ]),
          ],
          [
            'bar',
            new Set([
              {
                id: 'bar',
                messages: undefined,
                names: ['bar'],
                validator: expect.any(Function) as () => void,
              },
            ]),
          ],
        ]),
      );
    });

    it('should validators with messages', () => {
      const validatorMap = getValidatorMap(
        new Set([
          {
            id: 'foo',
            messages: { valueMissing: 'Input' },
            names: ['foo'],
            validator: () => '',
          },
        ]),
        { bar: () => '' },
        { valueMissing: 'Form' },
      );
      expect(validatorMap).toEqual(
        new Map([
          [
            'foo',
            new Set([
              {
                id: 'foo',
                messages: { valueMissing: 'Input' },
                names: ['foo'],
                validator: expect.any(Function) as () => void,
              },
            ]),
          ],
          [
            'bar',
            new Set([
              {
                id: 'bar',
                messages: { valueMissing: 'Form' },
                names: ['bar'],
                validator: expect.any(Function) as () => void,
              },
            ]),
          ],
        ]),
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
