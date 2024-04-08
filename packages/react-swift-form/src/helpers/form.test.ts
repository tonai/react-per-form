import {
  getFormInputs,
  getName,
  getValidatorMap,
  getValue,
  insertInMapSet,
  isCheckbox,
  isEvent,
  isFormElement,
} from './form';

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

  describe('getName', () => {
    it('should return the input name', () => {
      const input = document.createElement('input');
      expect(getName({ target: input })).toEqual(null);
      input.name = 'foo';
      expect(getName({ target: input })).toEqual('foo');
    });

    it('should return the select name', () => {
      const select = document.createElement('select');
      expect(getName({ target: select })).toEqual(null);
      select.name = 'foo';
      expect(getName({ target: select })).toEqual('foo');
    });

    it('should return the textarea name', () => {
      const textarea = document.createElement('textarea');
      expect(getName({ target: textarea })).toEqual(null);
      textarea.name = 'foo';
      expect(getName({ target: textarea })).toEqual('foo');
    });
  });

  describe('getValidatorMap', () => {
    it('should add field without validator', () => {
      const validatorMap = getValidatorMap(
        new Set([{ id: 'foo', names: ['foo'] }]),
      );
      expect(validatorMap).toEqual(
        new Map([['foo', new Set([{ id: 'foo', names: ['foo'] }])]]),
      );
    });

    it('should add field with validator function', () => {
      const validatorMap = getValidatorMap(
        new Set([{ id: 'foo', names: ['foo'], validators: () => '' }]),
      );
      expect(validatorMap).toEqual(
        new Map([
          [
            'foo',
            new Set([
              {
                id: 'foo',
                names: ['foo'],
              },
              {
                id: 'foo',
                names: ['foo'],
                validator: expect.any(Function) as () => void,
              },
            ]),
          ],
        ]),
      );
    });

    it('should add field with validator object', () => {
      const validatorMap = getValidatorMap(
        new Set([
          {
            id: 'foo',
            names: ['foo'],
            validators: { names: ['foo'], validator: () => '' },
          },
        ]),
      );
      expect(validatorMap).toEqual(
        new Map([
          [
            'foo',
            new Set([
              {
                id: 'foo',
                names: ['foo'],
              },
              {
                id: 'foo',
                names: ['foo'],
                validator: expect.any(Function) as () => void,
              },
            ]),
          ],
        ]),
      );
    });

    it('should add field with validator map object', () => {
      const validatorMap = getValidatorMap(
        new Set([
          {
            id: 'foobar',
            names: ['foo', 'bar'],
            validators: {
              bar: { names: ['bar'], validator: () => '' },
              foo: () => '',
            },
          },
        ]),
      );
      expect(validatorMap).toEqual(
        new Map([
          [
            'bar',
            new Set([
              {
                id: 'foobar',
                names: ['foo', 'bar'],
              },
              {
                id: 'bar',
                names: ['bar'],
                validator: expect.any(Function) as () => void,
              },
            ]),
          ],
          [
            'foo',
            new Set([
              {
                id: 'foobar',
                names: ['foo', 'bar'],
              },
              {
                id: 'foo',
                names: ['foo'],
                validator: expect.any(Function) as () => void,
              },
            ]),
          ],
        ]),
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
            validators: () => '',
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
              },
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

  describe('getValue', () => {
    it('should return the input value', () => {
      const input = document.createElement('input');
      expect(getValue({ target: input })).toEqual('');
      input.value = 'foo';
      expect(getValue({ target: input })).toEqual('foo');
    });

    it('should return the checkbox value', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      expect(getValue({ target: checkbox })).toEqual(false);
      checkbox.checked = true;
      expect(getValue({ target: checkbox })).toEqual(true);
    });

    it('should return the value without modifications', () => {
      const date = new Date();
      expect(getValue(date)).toEqual(date);
      expect(getValue({ target: {} })).toEqual({ target: {} });
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

  describe('isFormElement', () => {
    it('should test if param is formElement or not', () => {
      expect(isFormElement(document.createElement('div'))).toEqual(false);
      expect(isFormElement(document.createElement('input'))).toEqual(true);
      expect(isFormElement(document.createElement('select'))).toEqual(true);
      expect(isFormElement(document.createElement('textarea'))).toEqual(true);
    });
  });

  describe('isCheckbox', () => {
    it('should test if param is a checkbox or not', () => {
      const input = document.createElement('input');
      expect(isCheckbox(input)).toEqual(false);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      expect(isCheckbox(checkbox)).toEqual(true);
    });
  });

  describe('isEvent', () => {
    it('should test if param is event or not', () => {
      expect(isEvent({})).toEqual(false);
      expect(isEvent(new Event('click'))).toEqual(true);
    });
  });
});
