import type { IError, IRegisterParams } from '../types';

import { defaultSymbol, initialError } from '../constants';

import {
  displayErrors,
  focusError,
  getAllError,
  getCustomMessage,
  getData,
  getErrorObject,
  getFieldMessages,
  getFilteredErrors,
  getManualError,
  getNativeError,
  getNativeErrorKey,
  getNativeErrors,
  getValidatorError,
  getValidatorIds,
  hasError,
  isValidator,
  isValidatorObject,
  mergeErrors,
  setMainError,
  setValidatorError,
  validateForm,
} from './validator';

describe('validator helper', () => {
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

  describe('displayErrors', () => {
    it('should not display any error if there is no error (non native form validation)', () => {
      const errors = initialError;
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      displayErrors({
        display: true,
        errors,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors.mock.results[0].value).toEqual(initialError);
      formErrors.mockClear();
      displayErrors({
        display: true,
        errors,
        form,
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors.mock.results[0].value).toEqual(initialError);
      formErrors.mockClear();
      displayErrors({
        display: false,
        errors,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors.mock.results[0].value).toEqual(initialError);
      formErrors.mockClear();
      displayErrors({
        display: true,
        errors,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors.mock.results[0].value).toEqual(initialError);
    });

    it('should display the form errors (non native form validation)', () => {
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      displayErrors({
        display: true,
        errors,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      });
      formErrors.mockClear();
      displayErrors({
        display: true,
        errors,
        form,
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      });
      formErrors.mockClear();
      displayErrors({
        display: false,
        errors,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors.mock.results[0].value).toEqual(initialError);
      formErrors.mockClear();
      displayErrors({
        display: false,
        errors,
        form,
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors).not.toHaveBeenCalled();
    });

    it('should focus the error field (non native form validation)', () => {
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const spy = jest.spyOn(input1, 'focus');
      displayErrors({
        display: true,
        errors,
        focusOnError: true,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: true,
        errors,
        focusOnError: true,
        form,
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: false,
        errors,
        focusOnError: true,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: false,
        errors,
        focusOnError: true,
        form,
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should display the input errors (non native input validation)', () => {
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const inputErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const validators: [string, Set<IRegisterParams>][] = [
        [
          'foo',
          new Set([
            {
              id: 'foo',
              names: ['foo'],
              setErrors: inputErrors,
              validator: () => '',
            },
          ]),
        ],
      ];
      displayErrors({
        display: true,
        errors,
        focusOnError: false,
        form,
        names: ['foo'],
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(inputErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      });
      formErrors.mockClear();
      inputErrors.mockClear();
      displayErrors({
        display: true,
        errors,
        focusOnError: false,
        form,
        names: ['foo'],
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(inputErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      });
      formErrors.mockClear();
      inputErrors.mockClear();
      displayErrors({
        display: false,
        errors,
        focusOnError: false,
        form,
        names: ['foo'],
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(inputErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        manual: {},
        native: {},
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        manual: {},
        native: {},
        validator: {},
      });
      formErrors.mockClear();
      inputErrors.mockClear();
      displayErrors({
        display: false,
        errors,
        focusOnError: false,
        form,
        names: ['foo'],
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(formErrors).not.toHaveBeenCalled();
    });

    it('should focus the error field (non native input validation)', () => {
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const inputErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const validators: [string, Set<IRegisterParams>][] = [
        [
          'foo',
          new Set([
            {
              id: 'foo',
              names: ['foo'],
              setErrors: inputErrors,
              validator: () => '',
            },
          ]),
        ],
      ];
      const spy = jest.spyOn(input1, 'focus');
      displayErrors({
        display: true,
        errors,
        focusOnError: true,
        form,
        names: ['foo'],
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: true,
        errors,
        focusOnError: true,
        form,
        names: ['foo'],
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: false,
        errors,
        focusOnError: true,
        form,
        names: ['foo'],
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: false,
        errors,
        focusOnError: true,
        form,
        names: ['foo'],
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should trigger form reportValidity function (native form validation)', () => {
      const errors = initialError;
      const spy = jest.spyOn(form, 'reportValidity');
      displayErrors({
        display: true,
        errors,
        form,
        revalidate: true,
        setErrors: () => '',
        useNativeValidation: true,
        validatorEntries: [],
      });
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: true,
        errors,
        form,
        revalidate: false,
        setErrors: () => '',
        useNativeValidation: true,
        validatorEntries: [],
      });
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: false,
        errors,
        form,
        revalidate: true,
        setErrors: () => '',
        useNativeValidation: true,
        validatorEntries: [],
      });
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: false,
        errors,
        form,
        revalidate: false,
        setErrors: () => '',
        useNativeValidation: true,
        validatorEntries: [],
      });
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should trigger input reportValidity function (native input validation)', () => {
      input1.setAttribute('required', '');
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: {},
      };
      const spy = jest.spyOn(input1, 'reportValidity');
      displayErrors({
        display: true,
        errors,
        focusOnError: false,
        form,
        names: ['foo'],
        revalidate: true,
        setErrors: () => '',
        useNativeValidation: true,
        validatorEntries: [],
      });
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: true,
        errors,
        focusOnError: false,
        form,
        names: ['foo'],
        revalidate: false,
        setErrors: () => '',
        useNativeValidation: true,
        validatorEntries: [],
      });
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: false,
        errors,
        focusOnError: false,
        form,
        names: ['foo'],
        revalidate: true,
        setErrors: () => '',
        useNativeValidation: true,
        validatorEntries: [],
      });
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors({
        display: false,
        errors,
        focusOnError: false,
        form,
        names: ['foo'],
        revalidate: false,
        setErrors: () => '',
        useNativeValidation: true,
        validatorEntries: [],
      });
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should not display the local errors on the the form (filterLocalErrors=true)', () => {
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: {},
        validator: {
          foo: { error: 'error', global: false, names: ['foo'] },
        },
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const inputErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const validators: [string, Set<IRegisterParams>][] = [
        [
          'foo',
          new Set([
            {
              id: 'foo',
              names: ['foo'],
              setErrors: inputErrors,
              validator: () => 'error',
            },
          ]),
        ],
      ];
      displayErrors({
        display: true,
        errors,
        filterLocalErrors: true,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(inputErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: {},
        validator: {
          foo: { error: 'error', global: false, names: ['foo'] },
        },
      });
      expect(formErrors.mock.results[0].value).toEqual(initialError);
      inputErrors.mockClear();
      formErrors.mockClear();
      displayErrors({
        display: true,
        errors,
        filterLocalErrors: true,
        form,
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(inputErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: {},
        validator: {
          foo: { error: 'error', global: false, names: ['foo'] },
        },
      });
      expect(formErrors.mock.results[0].value).toEqual(initialError);
      inputErrors.mockClear();
      formErrors.mockClear();
      displayErrors({
        display: false,
        errors,
        filterLocalErrors: true,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(inputErrors.mock.results[0].value).toEqual(initialError);
      expect(formErrors.mock.results[0].value).toEqual(initialError);
      inputErrors.mockClear();
      formErrors.mockClear();
      displayErrors({
        display: false,
        errors,
        filterLocalErrors: true,
        form,
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: validators,
      });
      expect(inputErrors).not.toHaveBeenCalled();
      expect(formErrors).not.toHaveBeenCalled();
    });

    it('should display global validators on the form (filterLocalErrors=true)', () => {
      const errors: IError = {
        all: { foo: 'error' },
        global: {
          foo: { error: 'error', global: true, names: ['foo'] },
        },
        main: { error: 'error', global: true, id: 'foo', names: ['foo'] },
        manual: {},
        native: {},
        validator: {
          foo: { error: 'error', global: true, names: ['foo'] },
        },
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      displayErrors({
        display: true,
        errors,
        filterLocalErrors: true,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {
          foo: { error: 'error', global: true, names: ['foo'] },
        },
        main: { error: 'error', global: true, id: 'foo', names: ['foo'] },
        manual: {},
        native: {},
        validator: {
          foo: { error: 'error', global: true, names: ['foo'] },
        },
      });
      formErrors.mockClear();
      displayErrors({
        display: true,
        errors,
        filterLocalErrors: true,
        form,
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {
          foo: { error: 'error', global: true, names: ['foo'] },
        },
        main: { error: 'error', global: true, id: 'foo', names: ['foo'] },
        manual: {},
        native: {},
        validator: {
          foo: { error: 'error', global: true, names: ['foo'] },
        },
      });
      formErrors.mockClear();
      displayErrors({
        display: false,
        errors,
        filterLocalErrors: true,
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors.mock.results[0].value).toEqual(initialError);
      formErrors.mockClear();
      displayErrors({
        display: false,
        errors,
        filterLocalErrors: true,
        form,
        revalidate: false,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorEntries: [],
      });
      expect(formErrors).not.toHaveBeenCalled();
    });
  });

  describe('focusError', () => {
    it('should not set the focus (no error)', () => {
      const spy = jest.spyOn(input1, 'focus');
      expect(
        focusError(Array.from(form.elements) as HTMLInputElement[]),
      ).toEqual(false);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should set the focus on the right field', () => {
      const spy1 = jest.spyOn(input1, 'focus');
      const spy2 = jest.spyOn(input2, 'focus');
      expect(
        focusError(Array.from(form.elements) as HTMLInputElement[], {
          error: 'error',
          global: false,
          id: 'foo',
          names: ['foo'],
        }),
      ).toEqual(true);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
      spy1.mockClear();
      spy2.mockClear();
      expect(
        focusError(Array.from(form.elements) as HTMLInputElement[], {
          error: 'error',
          global: false,
          id: 'foobar',
          names: ['foo', 'bar'],
        }),
      ).toEqual(true);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
      spy1.mockClear();
      spy2.mockClear();
      expect(
        focusError(Array.from(form.elements) as HTMLInputElement[], {
          error: 'error',
          global: false,
          id: 'bar',
          names: ['bar'],
        }),
      ).toEqual(true);
      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      spy1.mockRestore();
      spy2.mockRestore();
    });

    it('should not set the focus (error is for another field)', () => {
      const spy = jest.spyOn(input1, 'focus');
      expect(
        focusError(Array.from(form.elements) as HTMLInputElement[], {
          error: 'error',
          global: false,
          id: 'baz',
          names: ['baz'],
        }),
      ).toEqual(false);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('getAllError', () => {
    it('should get the all error object', () => {
      expect(getAllError({}, {})).toEqual({});
      expect(getAllError({ foo: 'native' }, {})).toEqual({ foo: 'native' });
      expect(
        getAllError(
          {},
          { foobar: { error: 'validator', global: true, names: ['foo'] } },
          { foo: null },
        ),
      ).toEqual({ foo: 'validator' });
      expect(getAllError({ foo: '' }, {}, { foo: 'manual' })).toEqual({
        foo: 'manual',
      });
      expect(getAllError({ foo: 'native' }, {}, { foo: null })).toEqual({
        foo: 'native',
      });
      expect(
        getAllError(
          { foo: 'native' },
          { foobar: { error: 'validator', global: true, names: ['foo'] } },
        ),
      ).toEqual({ foo: 'native' });
      expect(
        getAllError(
          { foo: 'native' },
          { foobar: { error: 'validator', global: true, names: ['foo'] } },
          { foo: 'manual' },
        ),
      ).toEqual({ foo: 'native' });
    });
  });

  describe('getCustomMessage', () => {
    it('should return the custom message if exists', () => {
      expect(getCustomMessage(null)).toEqual('');
      expect(getCustomMessage('')).toEqual('');
      expect(getCustomMessage('custom')).toEqual('custom');
      expect(getCustomMessage('custom', { custom: 'Custom message' })).toEqual(
        'Custom message',
      );
    });
  });

  describe('getData', () => {
    it('should return all form data', () => {
      input1.setAttribute('value', '42');
      input2.setAttribute('value', 'baz');
      expect(getData({ form })).toEqual({
        bar: 'baz',
        foo: '42',
      });
      expect(getData({ form, values: { foo: 42 } })).toEqual({
        bar: 'baz',
        foo: 42,
      });
    });

    it('should return values for multiple fields', () => {
      const form = document.createElement('form');
      const email = document.createElement('input');
      email.setAttribute('name', 'email');
      email.setAttribute('type', 'email');
      email.setAttribute('multiple', '');
      email.setAttribute('value', 'foo@bar, bar@baz');
      form.appendChild(email);
      const select = document.createElement('select');
      select.setAttribute('name', 'select');
      select.setAttribute('multiple', '');
      const option1 = document.createElement('option');
      option1.setAttribute('value', 'opt1');
      option1.setAttribute('selected', '');
      select.appendChild(option1);
      const option2 = document.createElement('option');
      option2.setAttribute('value', 'opt2');
      option2.setAttribute('selected', '');
      select.appendChild(option2);
      form.appendChild(select);
      expect(getData({ form })).toEqual({
        email: ['foo@bar', 'bar@baz'],
        select: ['opt1', 'opt2'],
      });
      expect(getData({ form, values: { select: [1, 2] } })).toEqual({
        email: ['foo@bar', 'bar@baz'],
        select: [1, 2],
      });
    });

    it('should return filtered form data', () => {
      input1.setAttribute('value', '42');
      input2.setAttribute('value', 'baz');
      expect(getData({ form, names: ['foo'], values: {} })).toEqual({
        foo: '42',
      });
      expect(
        getData({ form, names: ['foo'], values: { bar: 'foo', foo: 42 } }),
      ).toEqual({
        foo: 42,
      });
    });

    it('should return transformed form data', () => {
      input1.setAttribute('value', '42');
      input2.setAttribute('value', 'baz');
      expect(getData({ form, transformers: { foo: Number } })).toEqual({
        bar: 'baz',
        foo: 42,
      });
      expect(
        getData({ form, names: ['foo'], transformers: { foo: Number } }),
      ).toEqual({
        foo: 42,
      });
      expect(
        getData({ form, transformers: { bar: Number }, values: { bar: '12' } }),
      ).toEqual({
        bar: 12,
        foo: '42',
      });
    });

    it('should return all selected options', () => {
      const select = document.createElement('select');
      select.setAttribute('name', 'select');
      select.setAttribute('multiple', '');
      const option1 = document.createElement('option');
      option1.setAttribute('value', 'option 1');
      option1.setAttribute('selected', '');
      select.appendChild(option1);
      const option2 = document.createElement('option');
      option2.setAttribute('value', 'option 2');
      option2.setAttribute('selected', '');
      select.appendChild(option2);
      const option3 = document.createElement('option');
      option3.setAttribute('value', 'option 3');
      select.appendChild(option3);
      form.appendChild(select);
      expect(getData({ form, names: ['select'] })).toEqual({
        select: ['option 1', 'option 2'],
      });
    });
  });

  describe('getErrorObject', () => {
    it('should create the error object', () => {
      expect(getErrorObject({ nativeErrors: {}, validatorErrors: {} })).toEqual(
        {
          all: {},
          global: {},
          manual: {},
          native: {},
          validator: {},
        },
      );
      expect(
        getErrorObject({
          nativeErrors: { foo: 'native' },
          validatorErrors: {},
        }),
      ).toEqual({
        all: { foo: 'native' },
        global: {},
        main: { error: 'native', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'native' },
        validator: {},
      });
      expect(
        getErrorObject({
          nativeErrors: {},
          validatorErrors: {
            foobar: { error: 'validator', global: true, names: ['foo'] },
          },
        }),
      ).toEqual({
        all: { foo: 'validator' },
        global: {
          foobar: { error: 'validator', global: true, names: ['foo'] },
        },
        main: {
          error: 'validator',
          global: true,
          id: 'foobar',
          names: ['foo'],
        },
        manual: {},
        native: {},
        validator: {
          foobar: { error: 'validator', global: true, names: ['foo'] },
        },
      });
      expect(
        getErrorObject({
          manualErrors: { foo: 'manual' },
          nativeErrors: {},
          validatorErrors: {},
        }),
      ).toEqual({
        all: { foo: 'manual' },
        global: {},
        main: { error: 'manual', global: false, id: 'foo', names: ['foo'] },
        manual: { foo: 'manual' },
        native: {},
        validator: {},
      });
      expect(
        getErrorObject({
          nativeErrors: { foo: 'native' },
          validatorErrors: {
            foobar: { error: 'validator', global: true, names: ['foo'] },
          },
        }),
      ).toEqual({
        all: { foo: 'native' },
        global: {
          foobar: { error: 'validator', global: true, names: ['foo'] },
        },
        main: { error: 'native', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'native' },
        validator: {
          foobar: { error: 'validator', global: true, names: ['foo'] },
        },
      });
      expect(
        getErrorObject({
          manualErrors: { foo: 'manual' },
          nativeErrors: {},
          validatorErrors: {
            foobar: { error: 'validator', global: true, names: ['foo'] },
          },
        }),
      ).toEqual({
        all: { foo: 'manual' },
        global: {
          foobar: { error: 'validator', global: true, names: ['foo'] },
        },
        main: { error: 'manual', global: false, id: 'foo', names: ['foo'] },
        manual: { foo: 'manual' },
        native: {},
        validator: {
          foobar: { error: 'validator', global: true, names: ['foo'] },
        },
      });
    });
  });

  describe('getFieldMessages', () => {
    it('should merge custom messages', () => {
      const validators = new Set([
        {
          id: 'foo',
          messages: { valueMissing: 'Did you miss something ?' },
          names: ['foo'],
          validator: () => '',
        },
      ]);
      expect(getFieldMessages(validators)).toEqual({
        valueMissing: 'Did you miss something ?',
      });
      expect(
        getFieldMessages(validators, {
          badInput: 'badInput',
        }),
      ).toEqual({
        badInput: 'badInput',
        valueMissing: 'Did you miss something ?',
      });
      expect(
        getFieldMessages(validators, {
          valueMissing: 'valueMissing',
        }),
      ).toEqual({
        valueMissing: 'Did you miss something ?',
      });
    });
  });

  describe('getFilteredErrors', () => {
    it('should filter errors', () => {
      expect(getFilteredErrors({ foo: 'error' })).toEqual({ foo: 'error' });
      expect(getFilteredErrors({ foo: 'error' }, ['foo'])).toEqual({
        foo: 'error',
      });
      expect(getFilteredErrors({ foo: 'error' }, ['bar'])).toEqual({});
    });
  });

  describe('getManualError', () => {
    it('should not return any error', () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      expect(getManualError({ form })).toEqual({});
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should return the manual error', () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      expect(getManualError({ errors: { foo: 'manual' }, form })).toEqual({
        foo: 'manual',
      });
      expect(spy).toHaveBeenCalledWith('manual');
      spy.mockRestore();
    });

    it('should return the manual error with custom message', () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      expect(
        getManualError({
          errors: { foo: 'manual' },
          fieldMessages: { foo: { manual: 'Manual error' } },
          form,
        }),
      ).toEqual({
        foo: 'Manual error',
      });
      expect(spy).toHaveBeenCalledWith('Manual error');
      spy.mockRestore();
    });

    it('should return the manual error with custom message fallback', () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      expect(
        getManualError({
          errors: { foo: 'manual' },
          fieldMessages: { [defaultSymbol]: { manual: 'Manual error' } },
          form,
        }),
      ).toEqual({
        foo: 'Manual error',
      });
      expect(spy).toHaveBeenCalledWith('Manual error');
      spy.mockRestore();
    });
  });

  describe('getNativeError', () => {
    it('should not return any error (valid)', () => {
      expect(getNativeError({ input: input1 })).toEqual('');
    });

    it('should return the native required error', () => {
      input1.setAttribute('required', '');
      expect(getNativeError({ input: input1 })).toEqual(
        'Constraints not satisfied',
      );
    });

    it('should return the custom required error', () => {
      input1.setAttribute('required', '');
      expect(
        getNativeError({
          input: input1,
          messages: { valueMissing: 'Did you miss something ?' },
        }),
      ).toEqual('Did you miss something ?');
    });
  });

  describe('getNativeErrorKey', () => {
    it('should not return any error key', () => {
      expect(getNativeErrorKey()).toEqual(null);
      expect(getNativeErrorKey(input1.validity)).toEqual(null);
    });

    it('should return the form native error key (required)', () => {
      input1.setAttribute('required', '');
      expect(getNativeErrorKey(input1.validity)).toEqual('valueMissing');
    });
  });

  describe('getNativeErrors', () => {
    it('should not return any error (valid)', () => {
      expect(getNativeErrors({ fieldMessages: {}, form })).toEqual({
        bar: '',
        foo: '',
        radio: '',
      });
    });

    it('should return native error', () => {
      input1.setAttribute('required', '');
      expect(getNativeErrors({ fieldMessages: {}, form })).toEqual({
        bar: '',
        foo: 'Constraints not satisfied',
        radio: '',
      });
    });

    it('should return native error with custom message', () => {
      input1.setAttribute('required', '');
      expect(
        getNativeErrors({
          fieldMessages: { foo: { valueMissing: 'Did you miss something ?' } },
          form,
        }),
      ).toEqual({
        bar: '',
        foo: 'Did you miss something ?',
        radio: '',
      });
      expect(
        getNativeErrors({
          fieldMessages: {
            [defaultSymbol]: { valueMissing: 'Did you miss something ?' },
          },
          form,
        }),
      ).toEqual({
        bar: '',
        foo: 'Did you miss something ?',
        radio: '',
      });
    });
  });

  describe('getValidatorError', () => {
    it('should not return any error (no validators)', async () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      expect(await getValidatorError({ form })).toEqual({
        validatorParams: [],
        validatorResults: [],
      });
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should return the validator error', async () => {
      const validators: [string, Set<IRegisterParams>][] = [
        [
          'foo',
          new Set([
            {
              id: 'foo',
              names: ['foo'],
              validator: () => 'validator',
            },
          ]),
        ],
      ];
      expect(
        await getValidatorError({ form, validatorEntries: validators }),
      ).toEqual({
        validatorParams: [
          {
            id: 'foo',
            name: 'foo',
            names: ['foo'],
            validator: expect.any(Function) as () => void,
          },
        ],
        validatorResults: ['validator'],
      });
    });

    it('should return the async validator error', async () => {
      const validators: [string, Set<IRegisterParams>][] = [
        [
          'foo',
          new Set([
            {
              id: 'foo',
              names: ['foo'],
              validator: () => Promise.resolve('validator'),
            },
          ]),
        ],
      ];
      expect(
        await getValidatorError({ form, validatorEntries: validators }),
      ).toEqual({
        validatorParams: [
          {
            id: 'foo',
            name: 'foo',
            names: ['foo'],
            validator: expect.any(Function) as () => void,
          },
        ],
        validatorResults: ['validator'],
      });
    });

    it('should not run the validator twice', async () => {
      const validator = jest.fn(() => 'validator');
      const validators: [string, Set<IRegisterParams>][] = [
        [
          'foo',
          new Set([
            {
              id: 'foobar',
              names: ['foo', 'bar'],
              validator,
            },
            {
              id: 'foobar',
              names: ['foo', 'bar'],
              validator,
            },
          ]),
        ],
      ];
      expect(
        await getValidatorError({ form, validatorEntries: validators }),
      ).toEqual({
        validatorParams: [
          {
            id: 'foobar',
            name: 'foo',
            names: ['foo', 'bar'],
            validator: expect.any(Function) as () => void,
          },
        ],
        validatorResults: ['validator'],
      });
      expect(validator).toHaveBeenCalledTimes(1);
    });
  });

  describe('setValidatorError', () => {
    it('should not return any error (no validators)', () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      expect(
        setValidatorError({ form, validatorParams: [], validatorResults: [] }),
      ).toEqual({});
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should return the validator error', () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      expect(
        setValidatorError({
          form,
          validatorParams: [
            {
              id: 'foo',
              name: 'foo',
              names: ['foo'],
              validator: () => 'validator',
            },
          ],
          validatorResults: ['validator'],
        }),
      ).toEqual({
        foo: { error: 'validator', global: true, names: ['foo'] },
      });
      expect(spy).toHaveBeenCalledWith('validator');
      spy.mockRestore();
    });

    it('should return the async validator error', () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      expect(
        setValidatorError({
          form,
          validatorParams: [
            {
              id: 'foo',
              name: 'foo',
              names: ['foo'],
              validator: () => 'validator',
            },
          ],
          validatorResults: ['validator'],
        }),
      ).toEqual({
        foo: { error: 'validator', global: true, names: ['foo'] },
      });
      expect(spy).toHaveBeenCalledWith('validator');
      spy.mockRestore();
    });

    it('should return the validator error with custom message', () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      expect(
        setValidatorError({
          fieldMessages: {
            foo: { validator: 'Validator error' },
          },
          form,
          validatorParams: [
            {
              id: 'foo',
              name: 'foo',
              names: ['foo'],
              validator: () => 'validator',
            },
          ],
          validatorResults: ['validator'],
        }),
      ).toEqual({
        foo: { error: 'Validator error', global: true, names: ['foo'] },
      });
      expect(spy).toHaveBeenCalledWith('Validator error');
      spy.mockRestore();
    });

    it('should return the validator error with custom message fallback', () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      expect(
        setValidatorError({
          fieldMessages: { [defaultSymbol]: { validator: 'Validator error' } },
          form,
          validatorParams: [
            {
              id: 'foo',
              name: 'foo',
              names: ['foo'],
              validator: () => 'validator',
            },
          ],
          validatorResults: ['validator'],
        }),
      ).toEqual({
        foo: { error: 'Validator error', global: true, names: ['foo'] },
      });
      expect(spy).toHaveBeenCalledWith('Validator error');
      spy.mockRestore();
    });
  });

  describe('getValidatorIds', () => {
    it('should return the id list of validators', () => {
      const validators: [string, Set<IRegisterParams>][] = [
        [
          'foo',
          new Set([
            {
              id: 'foobar',
              names: ['foo', 'bar'],
              validator: () => '',
            },
            {
              id: 'foobaz',
              names: ['foo', 'baz'],
              validator: () => '',
            },
            {
              id: 'foobarbaz',
              names: ['foo', 'bar', 'baz'],
              validator: () => '',
            },
          ]),
        ],
      ];
      expect(getValidatorIds(validators)).toEqual([
        'foobar',
        'foobaz',
        'foobarbaz',
      ]);
      expect(getValidatorIds(validators, ['bar'])).toEqual([
        'foobar',
        'foobarbaz',
      ]);
    });
  });

  describe('hasError', () => {
    it('should check if error object has some error', () => {
      expect(hasError(initialError)).toEqual(false);
      expect(
        hasError({
          all: { foo: 'error' },
          global: {},
          main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
          manual: {},
          native: { foo: 'error' },
          validator: {},
        }),
      ).toEqual(true);
    });
  });

  describe('isValidator', () => {
    it('should test if param is validator or not', () => {
      expect(isValidator(() => '')).toEqual(true);
      expect(isValidator({ names: ['foo'], validator: () => '' })).toEqual(
        false,
      );
      expect(isValidator({ foo: () => '' })).toEqual(false);
      expect(
        isValidator({ foo: { names: ['foo'], validator: () => '' } }),
      ).toEqual(false);
    });
  });

  describe('isValidatorObject', () => {
    it('should test if param is validatorObject or not', () => {
      expect(isValidatorObject(() => '')).toEqual(false);
      expect(
        isValidatorObject({ names: ['foo'], validator: () => '' }),
      ).toEqual(true);
      expect(isValidatorObject({ foo: () => '' })).toEqual(false);
      expect(
        isValidatorObject({ foo: { names: ['foo'], validator: () => '' } }),
      ).toEqual(false);
    });
  });

  describe('mergeErrors', () => {
    it('should merge the error objects', () => {
      expect(
        mergeErrors(initialError, {
          all: { foo: 'error' },
          global: { foobar: { error: 'error', global: true, names: ['foo'] } },
          main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
          manual: {},
          native: { foo: 'error' },
          validator: {
            foobar: { error: 'error', global: true, names: ['foo'] },
          },
        }),
      ).toEqual({
        all: { foo: 'error' },
        global: { foobar: { error: 'error', global: true, names: ['foo'] } },
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: { foobar: { error: 'error', global: true, names: ['foo'] } },
      });
      expect(
        mergeErrors(
          {
            all: { foo: 'error' },
            global: {
              foobar: { error: 'error', global: true, names: ['foo'] },
            },
            main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
            manual: {},
            native: { foo: 'error' },
            validator: {
              foobar: { error: 'error', global: true, names: ['foo'] },
            },
          },
          initialError,
        ),
      ).toEqual({
        all: { foo: 'error' },
        global: { foobar: { error: 'error', global: true, names: ['foo'] } },
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: { foobar: { error: 'error', global: true, names: ['foo'] } },
      });
      expect(
        mergeErrors(
          {
            all: { foo: 'prevError' },
            global: {},
            main: {
              error: 'prevError',
              global: false,
              id: 'foo',
              names: ['foo'],
            },
            manual: {},
            native: { foo: 'prevError' },
            validator: {},
          },
          {
            all: { foo: 'error' },
            global: {
              foobar: { error: 'error', global: true, names: ['foo'] },
            },
            main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
            manual: {},
            native: { foo: 'error' },
            validator: {
              foobar: { error: 'error', global: true, names: ['foo'] },
            },
          },
        ),
      ).toEqual({
        all: { foo: 'error' },
        global: { foobar: { error: 'error', global: true, names: ['foo'] } },
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        manual: {},
        native: { foo: 'error' },
        validator: { foobar: { error: 'error', global: true, names: ['foo'] } },
      });
    });
  });

  describe('setMainError', () => {
    it('should set the main error', () => {
      expect(
        setMainError({
          global: {},
          manual: {},
          native: { foo: 'native' },
          validator: {},
        }),
      ).toEqual({ error: 'native', global: false, id: 'foo', names: ['foo'] });
      expect(
        setMainError({
          global: {},
          manual: { foo: 'manual' },
          native: { foo: '' },
          validator: {},
        }),
      ).toEqual({
        error: 'manual',
        global: false,
        id: 'foo',
        names: ['foo'],
      });
      expect(
        setMainError({
          global: {},
          manual: {},
          native: { foo: '' },
          validator: {
            foo: { error: 'validator', global: true, names: ['foo'] },
          },
        }),
      ).toEqual({
        error: 'validator',
        global: true,
        id: 'foo',
        names: ['foo'],
      });
      expect(
        setMainError({
          global: {},
          manual: {},
          native: { foo: 'native' },
          validator: {
            foo: { error: 'validator', global: false, names: ['foo'] },
          },
        }),
      ).toEqual({ error: 'native', global: false, id: 'foo', names: ['foo'] });
      expect(
        setMainError({
          global: {},
          manual: { foo: 'manual' },
          native: { foo: '' },
          validator: {
            foo: { error: 'validator', global: false, names: ['foo'] },
          },
        }),
      ).toEqual({ error: 'manual', global: false, id: 'foo', names: ['foo'] });
    });
  });

  describe('validateForm', () => {
    it('should validate the form (no error)', async () => {
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      expect(
        await validateForm({
          display: true,
          form,
          revalidate: true,
          setErrors: formErrors,
          useNativeValidation: false,
          validatorMap: new Map(),
        }),
      ).toEqual({
        all: { bar: '', foo: '', radio: '' },
        global: {},
        manual: {},
        native: { bar: '', foo: '', radio: '' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        manual: {},
        native: {},
        validator: {},
      });
    });

    it('should return the required error', async () => {
      input1.setAttribute('required', '');
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      expect(
        await validateForm({
          display: true,
          form,
          revalidate: true,
          setErrors: formErrors,
          useNativeValidation: false,
          validatorMap: new Map(),
        }),
      ).toEqual({
        all: { bar: '', foo: 'Constraints not satisfied', radio: '' },
        global: {},
        main: {
          error: 'Constraints not satisfied',
          global: false,
          id: 'foo',
          names: ['foo'],
        },
        manual: {},
        native: { bar: '', foo: 'Constraints not satisfied', radio: '' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { bar: '', foo: 'Constraints not satisfied', radio: '' },
        global: {},
        main: {
          error: 'Constraints not satisfied',
          global: false,
          id: 'foo',
          names: ['foo'],
        },
        manual: {},
        native: { bar: '', foo: 'Constraints not satisfied', radio: '' },
        validator: {},
      });
    });

    it('should return the required error with custom message', async () => {
      input1.setAttribute('required', '');
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      expect(
        await validateForm({
          display: true,
          errors: {},
          form,
          messages: {
            valueMissing: 'Did you miss something ?',
          },
          revalidate: true,
          setErrors: formErrors,
          useNativeValidation: false,
          validatorMap: new Map(),
          values: {},
        }),
      ).toEqual({
        all: { bar: '', foo: 'Did you miss something ?', radio: '' },
        global: {},
        main: {
          error: 'Did you miss something ?',
          global: false,
          id: 'foo',
          names: ['foo'],
        },
        manual: {},
        native: { bar: '', foo: 'Did you miss something ?', radio: '' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { bar: '', foo: 'Did you miss something ?', radio: '' },
        global: {},
        main: {
          error: 'Did you miss something ?',
          global: false,
          id: 'foo',
          names: ['foo'],
        },
        manual: {},
        native: { bar: '', foo: 'Did you miss something ?', radio: '' },
        validator: {},
      });
    });

    it('should return the validator error', async () => {
      const spy = jest.spyOn(input1, 'setCustomValidity');
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const validators = new Map([
        [
          'foo',
          new Set([
            {
              id: 'foobar',
              names: ['foo', 'bar'],
              validator: () => 'Custom error',
            },
          ]),
        ],
      ]);
      expect(
        await validateForm({
          display: true,
          form,
          revalidate: true,
          setErrors: formErrors,
          useNativeValidation: false,
          validatorMap: validators,
        }),
      ).toEqual({
        all: { bar: 'Custom error', foo: 'Custom error', radio: '' },
        global: {
          foobar: {
            error: 'Custom error',
            global: true,
            names: ['foo', 'bar'],
          },
        },
        main: {
          error: 'Custom error',
          global: true,
          id: 'foobar',
          names: ['foo', 'bar'],
        },
        manual: {},
        native: { bar: '', foo: '', radio: '' },
        validator: {
          foobar: {
            error: 'Custom error',
            global: true,
            names: ['foo', 'bar'],
          },
        },
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { bar: 'Custom error', foo: 'Custom error', radio: '' },
        global: {
          foobar: {
            error: 'Custom error',
            global: true,
            names: ['foo', 'bar'],
          },
        },
        main: {
          error: 'Custom error',
          global: true,
          id: 'foobar',
          names: ['foo', 'bar'],
        },
        manual: {},
        native: { bar: '', foo: '', radio: '' },
        validator: {
          foobar: {
            error: 'Custom error',
            global: true,
            names: ['foo', 'bar'],
          },
        },
      });
      expect(spy).toHaveBeenCalledWith('Custom error');
      spy.mockRestore();
    });
  });

  it('should return the manual error', async () => {
    const spy = jest.spyOn(input1, 'setCustomValidity');
    const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
      typeof d === 'function' ? d(initialError) : d,
    );
    expect(
      await validateForm({
        display: true,
        errors: { foo: 'Manual error' },
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorMap: new Map(),
        values: {},
      }),
    ).toEqual({
      all: { bar: '', foo: 'Manual error', radio: '' },
      global: {},
      main: {
        error: 'Manual error',
        global: false,
        id: 'foo',
        names: ['foo'],
      },
      manual: { foo: 'Manual error' },
      native: { bar: '', foo: '', radio: '' },
      validator: {},
    });
    expect(formErrors.mock.results[0].value).toEqual({
      all: { bar: '', foo: 'Manual error', radio: '' },
      global: {},
      main: {
        error: 'Manual error',
        global: false,
        id: 'foo',
        names: ['foo'],
      },
      manual: { foo: 'Manual error' },
      native: { bar: '', foo: '', radio: '' },
      validator: {},
    });
    expect(spy).toHaveBeenCalledWith('Manual error');
    spy.mockRestore();
  });

  it('should reset the manual error', async () => {
    const spy = jest.spyOn(input1, 'setCustomValidity');
    const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
      typeof d === 'function' ? d(initialError) : d,
    );
    expect(
      await validateForm({
        display: true,
        errors: { foo: '' },
        form,
        revalidate: true,
        setErrors: formErrors,
        useNativeValidation: false,
        validatorMap: new Map(),
        values: {},
      }),
    ).toEqual({
      all: { bar: '', foo: '', radio: '' },
      global: {},
      manual: { foo: '' },
      native: { bar: '', foo: '', radio: '' },
      validator: {},
    });
    expect(formErrors.mock.results[0].value).toEqual({
      all: {},
      global: {},
      manual: {},
      native: {},
      validator: {},
    });
    expect(spy).toHaveBeenCalledWith('');
    spy.mockRestore();
  });
});
