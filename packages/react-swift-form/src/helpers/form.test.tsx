import { fireEvent, render, screen } from '@testing-library/react';

import {
  getFormInputs,
  getInputValue,
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

  describe('getInputValue', () => {
    it('should return the input value', () => {
      const text = document.createElement('input');
      text.setAttribute('name', 'text');
      text.setAttribute('value', 'some value');
      expect(getInputValue(text.value, text)).toEqual('some value');
    });

    it('should return the input file value', () => {
      render(<input data-testid="file" type="file" />);
      const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });
      fireEvent.change(screen.getByTestId('file'), {
        target: { files: [file] },
      });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const input = screen.getByTestId('file') as HTMLInputElement;
      expect(getInputValue(input.value, input)).toEqual(expect.any(File));
    });

    it('should return multiple file values', () => {
      render(<input data-testid="file" multiple type="file" />);
      const file1 = new File(['foo'], 'foo.txt', { type: 'text/plain' });
      const file2 = new File(['bar'], 'bar.txt', { type: 'text/plain' });
      fireEvent.change(screen.getByTestId('file'), {
        target: { files: [file1, file2] },
      });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const input = screen.getByTestId('file') as HTMLInputElement;
      expect(getInputValue(input.value, input)).toEqual([
        expect.any(File),
        expect.any(File),
      ]);
    });

    it('should return multiple email values', () => {
      const email = document.createElement('input');
      email.setAttribute('name', 'email');
      email.setAttribute('type', 'email');
      email.setAttribute('multiple', 'email');
      email.setAttribute('value', 'foo@bar, bar@baz');
      expect(getInputValue(email.value, email)).toEqual(['foo@bar', 'bar@baz']);
    });

    it('should return multiple selected values', () => {
      const select = document.createElement('select');
      select.setAttribute('name', 'select');
      select.setAttribute('multiple', '');
      const option1 = document.createElement('option');
      option1.setAttribute('value', 'opt 1');
      option1.setAttribute('selected', '');
      select.appendChild(option1);
      const option2 = document.createElement('option');
      const option2Text = document.createTextNode('Option 2');
      option2.appendChild(option2Text);
      option2.setAttribute('selected', '');
      select.appendChild(option2);
      const option3 = document.createElement('option');
      option3.setAttribute('value', 'opt 3');
      select.appendChild(option3);
      expect(getInputValue(select.value, select)).toEqual([
        'opt 1',
        'Option 2',
      ]);
    });
  });

  describe('getName', () => {
    it('should return the input name', () => {
      const input = document.createElement('input');
      expect(getName({ target: input })).toEqual('');
      input.name = 'foo';
      expect(getName({ target: input })).toEqual('foo');
    });

    it('should return the select name', () => {
      const select = document.createElement('select');
      expect(getName({ target: select })).toEqual('');
      select.name = 'foo';
      expect(getName({ target: select })).toEqual('foo');
    });

    it('should return the textarea name', () => {
      const textarea = document.createElement('textarea');
      expect(getName({ target: textarea })).toEqual('');
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

    it('should return the value for multiple email', () => {
      const email = document.createElement('input');
      email.setAttribute('name', 'email');
      email.setAttribute('type', 'email');
      email.setAttribute('multiple', '');
      expect(getValue({ target: email })).toEqual(['']);
      email.setAttribute('value', 'foo@bar, bar@baz');
      expect(getValue({ target: email })).toEqual(['foo@bar', 'bar@baz']);
    });

    it('should return the value for multiple select', () => {
      const select = document.createElement('select');
      select.setAttribute('name', 'select');
      select.setAttribute('multiple', '');
      const option1 = document.createElement('option');
      option1.setAttribute('value', 'opt1');
      select.appendChild(option1);
      const option2 = document.createElement('option');
      option2.setAttribute('value', 'opt2');
      select.appendChild(option2);
      expect(getValue({ target: select })).toEqual([]);
      option1.setAttribute('selected', '');
      option2.setAttribute('selected', '');
      expect(getValue({ target: select })).toEqual(['opt1', 'opt2']);
    });

    it('should return the value without modifications', () => {
      const date = new Date();
      expect(getValue(date)).toEqual(date);
      expect(getValue({ target: {} })).toEqual({ target: {} });
    });

    it('should return the transformed value', () => {
      expect(getValue('42', Number)).toEqual(42);
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
