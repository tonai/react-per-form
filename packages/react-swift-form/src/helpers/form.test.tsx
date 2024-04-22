import type { IFormElement } from '../types';

import { fireEvent, render, screen } from '@testing-library/react';

import {
  getDefaultValues,
  getFieldStates,
  getFormInput,
  getFormInputs,
  getFormStates,
  getInputValue,
  getLocalFields,
  getName,
  getTransformers,
  getValidators,
  getValue,
  isCheckbox,
  isEvent,
  isFormElement,
  shouldBlur,
  shouldChange,
} from './form';

describe('form helper', () => {
  let form: HTMLFormElement;
  let input1: HTMLInputElement;
  let input2: HTMLInputElement;
  let input3: HTMLInputElement;
  let input4: HTMLInputElement;

  beforeEach(() => {
    form = document.createElement('form');
    input1 = document.createElement('input');
    input1.setAttribute('name', 'foo');
    input1.setAttribute('value', '');
    form.appendChild(input1);
    input2 = document.createElement('input');
    input2.setAttribute('name', 'bar');
    input2.setAttribute('value', '');
    form.appendChild(input2);
    input3 = document.createElement('input');
    input3.setAttribute('name', 'radio');
    input3.setAttribute('type', 'checkbox');
    input3.setAttribute('value', '1');
    form.appendChild(input3);
    input4 = document.createElement('input');
    input4.setAttribute('name', 'radio');
    input4.setAttribute('type', 'checkbox');
    input4.setAttribute('value', '2');
    form.appendChild(input4);
  });

  describe('getDefaultValues', () => {
    it('should return the merged default values', () => {
      expect(getDefaultValues(new Set(), {})).toEqual({});
      expect(
        getDefaultValues(new Set([{ id: 'foo', names: ['foo'] }]), {}),
      ).toEqual({});
      expect(getDefaultValues(new Set(), { foo: 42 })).toEqual({
        foo: 42,
      });
      expect(
        getDefaultValues(new Set([{ id: 'foo', names: ['foo'] }]), {
          foo: 42,
        }),
      ).toEqual({ foo: 42 });
      expect(
        getDefaultValues(
          new Set([
            { defaultValues: { foo: '42' }, id: 'foo', names: ['foo'] },
            { defaultValues: { bar: 12 }, id: 'bar', names: ['bar'] },
          ]),
          {
            foo: 42,
          },
        ),
      ).toEqual({ bar: 12, foo: '42' });
      expect(
        getDefaultValues(
          new Set([
            { defaultValues: { foo: '42' }, id: 'foo', names: ['foo'] },
            { defaultValues: { bar: 12 }, id: 'bar', names: ['bar'] },
          ]),
          {
            foo: 42,
          },
          { foo: 'foo' },
          { bar: 'bar' },
        ),
      ).toEqual({ bar: 'bar', foo: 'foo' });
    });
  });

  describe('getFieldStates', () => {
    it('should return the field states', () => {
      expect(
        getFieldStates(
          {
            changedFields: [],
            dirtyFields: [],
            isChanged: false,
            isDirty: false,
            isPristine: true,
            isReady: false,
            isSubmitted: false,
            isSubmitting: false,
            isTouched: false,
            isValid: true,
            isValidating: false,
            submitCount: 0,
            touchedFields: [],
          },
          'foo',
        ),
      ).toEqual({
        changedFields: [],
        dirtyFields: [],
        isChanged: false,
        isDirty: false,
        isPristine: true,
        isReady: false,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: false,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: [],
      });
      expect(
        getFieldStates(
          {
            changedFields: ['foo', 'bar', 'baz'],
            dirtyFields: ['foo', 'bar', 'baz'],
            isChanged: true,
            isDirty: true,
            isPristine: false,
            isReady: false,
            isSubmitted: false,
            isSubmitting: false,
            isTouched: true,
            isValid: true,
            isValidating: false,
            submitCount: 0,
            touchedFields: ['foo', 'bar', 'baz'],
          },
          'foo',
        ),
      ).toEqual({
        changedFields: ['foo'],
        dirtyFields: ['foo'],
        isChanged: true,
        isDirty: true,
        isPristine: false,
        isReady: false,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: true,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: ['foo'],
      });
      expect(
        getFieldStates(
          {
            changedFields: ['bar'],
            dirtyFields: ['bar'],
            isChanged: true,
            isDirty: true,
            isPristine: false,
            isReady: false,
            isSubmitted: false,
            isSubmitting: false,
            isTouched: true,
            isValid: true,
            isValidating: false,
            submitCount: 0,
            touchedFields: ['bar'],
          },
          ['foo'],
        ),
      ).toEqual({
        changedFields: [],
        dirtyFields: [],
        isChanged: false,
        isDirty: false,
        isPristine: true,
        isReady: false,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: false,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: [],
      });
    });
  });

  describe('getFormInput', () => {
    it('should return the form input', () => {
      // @ts-expect-error access HTMLFormControlsCollection with input name
      expect(getFormInput(form.elements.foo as IFormElement)).toEqual(input1);
      // @ts-expect-error access HTMLFormControlsCollection with input name
      expect(getFormInput(form.elements.bar as IFormElement)).toEqual(input2);
      // @ts-expect-error access HTMLFormControlsCollection with input name
      expect(getFormInput(form.elements.radio as IFormElement)).toEqual(input3);
    });
  });

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

  describe('getFormStates', () => {
    it('should return the form states', () => {
      expect(
        getFormStates(
          {
            changedFields: new Set(),
            isReady: true,
            isSubmitting: false,
            isValid: true,
            isValidating: false,
            submitCount: 0,
            touchedFields: new Set(),
          },
          {},
          {},
        ),
      ).toEqual({
        changedFields: [],
        dirtyFields: [],
        isChanged: false,
        isDirty: false,
        isPristine: true,
        isReady: true,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: false,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: [],
      });
    });

    it('should return the form states with the right dirty calculation', () => {
      expect(
        getFormStates(
          {
            changedFields: new Set(),
            isReady: true,
            isSubmitting: false,
            isValid: true,
            isValidating: false,
            submitCount: 0,
            touchedFields: new Set(),
          },
          { foo: 'bar' },
          {},
        ),
      ).toEqual({
        changedFields: [],
        dirtyFields: [],
        isChanged: false,
        isDirty: false,
        isPristine: true,
        isReady: true,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: false,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: [],
      });
      expect(
        getFormStates(
          {
            changedFields: new Set(['foo']),
            isReady: true,
            isSubmitting: false,
            isValid: true,
            isValidating: false,
            submitCount: 0,
            touchedFields: new Set(),
          },
          { foo: 'bar' },
          {},
        ),
      ).toEqual({
        changedFields: ['foo'],
        dirtyFields: ['foo'],
        isChanged: true,
        isDirty: true,
        isPristine: false,
        isReady: true,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: false,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: [],
      });
      expect(
        getFormStates(
          {
            changedFields: new Set(['foo']),
            isReady: true,
            isSubmitting: false,
            isValid: true,
            isValidating: false,
            submitCount: 0,
            touchedFields: new Set(),
          },
          { foo: 'bar' },
          { foo: 'bar' },
        ),
      ).toEqual({
        changedFields: ['foo'],
        dirtyFields: [],
        isChanged: true,
        isDirty: false,
        isPristine: true,
        isReady: true,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: false,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: [],
      });
      input1.setAttribute('value', 'bar');
      expect(
        getFormStates(
          {
            changedFields: new Set(['foo']),
            isReady: true,
            isSubmitting: false,
            isValid: true,
            isValidating: false,
            submitCount: 0,
            touchedFields: new Set(),
          },
          { foo: 'bar' },
          {},
          form,
        ),
      ).toEqual({
        changedFields: ['foo'],
        dirtyFields: [],
        isChanged: true,
        isDirty: false,
        isPristine: true,
        isReady: true,
        isSubmitted: false,
        isSubmitting: false,
        isTouched: false,
        isValid: true,
        isValidating: false,
        submitCount: 0,
        touchedFields: [],
      });
    });
  });

  describe('getInputValue', () => {
    it('should return the input value', () => {
      const text = document.createElement('input');
      text.setAttribute('name', 'text');
      text.setAttribute('value', 'some value');
      expect(getInputValue(text)).toEqual('some value');
    });

    it('should return the input file value', () => {
      render(<input data-testid="file" type="file" />);
      const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });
      fireEvent.change(screen.getByTestId('file'), {
        target: { files: [file] },
      });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const input = screen.getByTestId('file') as HTMLInputElement;
      expect(getInputValue(input)).toEqual(expect.any(File));
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
      expect(getInputValue(input)).toEqual([
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
      expect(getInputValue(email)).toEqual(['foo@bar', 'bar@baz']);
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
      expect(getInputValue(select)).toEqual(['opt 1', 'Option 2']);
    });
  });

  describe('getLocalFields', () => {
    it('should return local fields', () => {
      const setErrors = (): null => null;
      const validatorMap = new Set([
        { id: 'foobar', names: ['foo', 'bar'], setErrors },
        { id: 'baz', names: ['baz'] },
      ]);
      expect(getLocalFields(validatorMap)).toEqual({
        bar: setErrors,
        foo: setErrors,
      });
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

    it('should return null in other cases', () => {
      expect(getName(42)).toEqual(null);
    });
  });

  describe('getTransformers', () => {
    it('should return the merged transformers', () => {
      expect(getTransformers(new Set())).toEqual(undefined);
      expect(getTransformers(new Set([{ id: 'foo', names: ['foo'] }]))).toEqual(
        {},
      );
      expect(getTransformers(new Set(), { foo: Number })).toEqual({
        foo: Number,
      });
      expect(
        getTransformers(new Set([{ id: 'foo', names: ['foo'] }]), {
          foo: Number,
        }),
      ).toEqual({ foo: Number });
      expect(
        getTransformers(
          new Set([
            { id: 'foo', names: ['foo'], transformers: { foo: String } },
          ]),
          {
            foo: Number,
          },
        ),
      ).toEqual({ foo: String });
    });
  });

  describe('getValidators', () => {
    it('should add field without validator', () => {
      const validatorMap = getValidators(
        new Set([{ id: 'foo', names: ['foo'], setErrors: () => null }]),
      );
      expect(validatorMap).toEqual([
        {
          id: 'foo',
          names: ['foo'],
          setErrors: expect.any(Function) as () => void,
        },
      ]);
    });

    it('should add field with validator function', () => {
      const validatorMap = getValidators(
        new Set([
          {
            id: 'foo',
            names: ['foo'],
            setErrors: () => null,
            validators: () => '',
          },
        ]),
      );
      expect(validatorMap).toEqual([
        {
          id: 'foo',
          names: ['foo'],
          setErrors: expect.any(Function) as () => void,
        },
        {
          id: 'foo',
          names: ['foo'],
          setErrors: expect.any(Function) as () => void,
          validator: expect.any(Function) as () => void,
        },
      ]);
    });

    it('should add field with validator object', () => {
      const validatorMap = getValidators(
        new Set([
          {
            id: 'foo',
            names: ['foo'],
            setErrors: () => null,
            validators: { names: ['foo'], validator: () => '' },
          },
        ]),
      );
      expect(validatorMap).toEqual([
        {
          id: 'foo',
          names: ['foo'],
          setErrors: expect.any(Function) as () => void,
        },
        {
          id: 'foo',
          names: ['foo'],
          setErrors: expect.any(Function) as () => void,
          validator: expect.any(Function) as () => void,
        },
      ]);
    });

    it('should add field with validator map object', () => {
      const validatorMap = getValidators(
        new Set([
          {
            id: 'foobar',
            names: ['foo', 'bar'],
            setErrors: () => null,
            validators: {
              bar: { names: ['bar'], validator: () => '' },
              foo: () => '',
            },
          },
        ]),
      );
      expect(validatorMap).toEqual([
        {
          id: 'foobar',
          names: ['foo', 'bar'],
          setErrors: expect.any(Function) as () => void,
        },
        {
          id: 'bar',
          names: ['bar'],
          setErrors: expect.any(Function) as () => void,
          validator: expect.any(Function) as () => void,
        },
        {
          id: 'foo',
          names: ['foo'],
          setErrors: expect.any(Function) as () => void,
          validator: expect.any(Function) as () => void,
        },
      ]);
    });

    it('should add simple form validator', () => {
      const validatorMap = getValidators(new Set(), {
        bar: () => '',
        foo: { names: ['foo'], validator: () => '' },
      });
      expect(validatorMap).toEqual([
        {
          id: 'bar',
          messages: undefined,
          names: ['bar'],
          validator: expect.any(Function) as () => void,
        },
        {
          id: 'foo',
          messages: undefined,
          names: ['foo'],
          validator: expect.any(Function) as () => void,
        },
      ]);
    });

    it('should validators with messages', () => {
      const validatorMap = getValidators(
        new Set([
          {
            id: 'foo',
            messages: { valueMissing: 'Input' },
            names: ['foo'],
            setErrors: () => null,
            validators: () => '',
          },
        ]),
        { bar: () => '' },
        { valueMissing: 'Form' },
      );
      expect(validatorMap).toEqual([
        {
          id: 'foo',
          messages: { valueMissing: 'Input' },
          names: ['foo'],
          setErrors: expect.any(Function) as () => void,
        },
        {
          id: 'foo',
          messages: { valueMissing: 'Input' },
          names: ['foo'],
          setErrors: expect.any(Function) as () => void,
          validator: expect.any(Function) as () => void,
        },
        {
          id: 'bar',
          messages: { valueMissing: 'Form' },
          names: ['bar'],
          validator: expect.any(Function) as () => void,
        },
      ]);
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

  describe('shouldBlur', () => {
    it('should return true', () => {
      expect(shouldBlur(new Set(), 'foo', 'bar')).toEqual(true);
      expect(shouldBlur(new Set(), 'foo', ['bar', 'baz'])).toEqual(true);
      expect(
        shouldBlur(
          new Set([{ id: 'bar', names: ['bar'], onBlurOptOut: 'bar' }]),
          'foo',
        ),
      ).toEqual(true);
      expect(
        shouldBlur(
          new Set([
            { id: 'bar', names: ['bar'], onBlurOptOut: 'bar' },
            { id: 'baz', names: ['baz'], onBlurOptOut: 'baz' },
            {
              id: 'bar;baz',
              names: ['bar', 'baz'],
              onBlurOptOut: ['bar', 'baz'],
            },
          ]),
          'foo',
        ),
      ).toEqual(true);
    });

    it('should return false', () => {
      expect(shouldBlur(new Set(), 'foo', 'foo')).toEqual(false);
      expect(shouldBlur(new Set(), 'foo', ['foo', 'bar', 'baz'])).toEqual(
        false,
      );
      expect(
        shouldBlur(
          new Set([{ id: 'foo', names: ['foo'], onBlurOptOut: 'foo' }]),
          'foo',
        ),
      ).toEqual(false);
      expect(
        shouldBlur(
          new Set([
            { id: 'bar', names: ['bar'], onBlurOptOut: 'bar' },
            { id: 'baz', names: ['baz'], onBlurOptOut: 'baz' },
            {
              id: 'foo;bar;baz',
              names: ['foo', 'bar', 'baz'],
              onBlurOptOut: ['foo', 'bar', 'baz'],
            },
          ]),
          'foo',
        ),
      ).toEqual(false);
    });
  });

  describe('shouldChange', () => {
    it('should return true', () => {
      expect(shouldChange(new Set(), 'foo', 'bar')).toEqual(true);
      expect(shouldChange(new Set(), 'foo', ['bar', 'baz'])).toEqual(true);
      expect(
        shouldChange(
          new Set([{ id: 'bar', names: ['bar'], onChangeOptOut: 'bar' }]),
          'foo',
        ),
      ).toEqual(true);
      expect(
        shouldChange(
          new Set([
            { id: 'bar', names: ['bar'], onChangeOptOut: 'bar' },
            { id: 'baz', names: ['baz'], onChangeOptOut: 'baz' },
            {
              id: 'bar;baz',
              names: ['bar', 'baz'],
              onChangeOptOut: ['bar', 'baz'],
            },
          ]),
          'foo',
        ),
      ).toEqual(true);
    });

    it('should return false', () => {
      expect(shouldChange(new Set(), 'foo', 'foo')).toEqual(false);
      expect(shouldChange(new Set(), 'foo', ['foo', 'bar', 'baz'])).toEqual(
        false,
      );
      expect(
        shouldChange(
          new Set([{ id: 'foo', names: ['foo'], onChangeOptOut: 'foo' }]),
          'foo',
        ),
      ).toEqual(false);
      expect(
        shouldChange(
          new Set([
            { id: 'bar', names: ['bar'], onChangeOptOut: 'bar' },
            { id: 'baz', names: ['baz'], onChangeOptOut: 'baz' },
            {
              id: 'foo;bar;baz',
              names: ['foo', 'bar', 'baz'],
              onChangeOptOut: ['foo', 'bar', 'baz'],
            },
          ]),
          'foo',
        ),
      ).toEqual(false);
    });
  });
});
