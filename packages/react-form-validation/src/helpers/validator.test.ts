import type { IError, IFormElement, ISetValidatorsParams } from '../types';

import { initialError } from '../constants';

import {
  displayErrors,
  focusError,
  getAllError,
  getData,
  getErrorObject,
  getFieldMessages,
  getFilteredErrors,
  getFormInput,
  getNativeError,
  getNativeErrorKey,
  getValidatorError,
  getValidatorIds,
  hasError,
  isValidator,
  isValidatorObject,
  mergeErrors,
  setMainError,
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
      displayErrors(errors, form, [], formErrors, true, true, false);
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
      formErrors.mockClear();
      displayErrors(errors, form, [], formErrors, true, false, false);
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
      formErrors.mockClear();
      displayErrors(errors, form, [], formErrors, false, true, false);
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
      formErrors.mockClear();
      displayErrors(errors, form, [], formErrors, true, true, false);
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
    });

    it('should display the form errors (non native form validation)', () => {
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      displayErrors(errors, form, [], formErrors, true, true, false);
      expect(formErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
      formErrors.mockClear();
      displayErrors(errors, form, [], formErrors, true, false, false);
      expect(formErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
      formErrors.mockClear();
      displayErrors(errors, form, [], formErrors, false, true, false);
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
      formErrors.mockClear();
      displayErrors(errors, form, [], formErrors, false, false, false);
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
    });

    it('should focus the error field (non native form validation)', () => {
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const spy = jest.spyOn(input1, 'focus');
      displayErrors(errors, form, [], formErrors, true, true, false, true);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], formErrors, true, false, false, true);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], formErrors, false, true, false, true);
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], formErrors, false, false, false, true);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should display the input errors (non native input validation)', () => {
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const inputErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const validators: [string, Set<ISetValidatorsParams>][] = [
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
      displayErrors(
        errors,
        form,
        validators,
        formErrors,
        true,
        true,
        false,
        false,
        ['foo'],
      );
      expect(inputErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
      formErrors.mockClear();
      inputErrors.mockClear();
      displayErrors(
        errors,
        form,
        validators,
        formErrors,
        true,
        false,
        false,
        false,
        ['foo'],
      );
      expect(inputErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
      formErrors.mockClear();
      inputErrors.mockClear();
      displayErrors(
        errors,
        form,
        validators,
        formErrors,
        false,
        true,
        false,
        false,
        ['foo'],
      );
      expect(inputErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
      formErrors.mockClear();
      inputErrors.mockClear();
      displayErrors(
        errors,
        form,
        validators,
        formErrors,
        false,
        false,
        false,
        false,
        ['foo'],
      );
      expect(inputErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
    });

    it('should focus the error field (non native input validation)', () => {
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const inputErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      const validators: [string, Set<ISetValidatorsParams>][] = [
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
      displayErrors(
        errors,
        form,
        validators,
        formErrors,
        true,
        true,
        false,
        true,
        ['foo'],
      );
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(
        errors,
        form,
        validators,
        formErrors,
        true,
        false,
        false,
        true,
        ['foo'],
      );
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(
        errors,
        form,
        validators,
        formErrors,
        false,
        true,
        false,
        true,
        ['foo'],
      );
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
      displayErrors(
        errors,
        form,
        validators,
        formErrors,
        false,
        false,
        false,
        true,
        ['foo'],
      );
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should trigger form reportValidity function (native form validation)', () => {
      const errors = initialError;
      const spy = jest.spyOn(form, 'reportValidity');
      displayErrors(errors, form, [], () => '', true, true, true);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], () => '', true, false, true);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], () => '', false, true, true);
      expect(spy).not.toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], () => '', false, false, true);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should trigger input reportValidity function (native input validation)', () => {
      input1.setAttribute('required', '');
      const errors: IError = {
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      };
      const spy = jest.spyOn(input1, 'reportValidity');
      displayErrors(errors, form, [], () => '', true, true, true, false, [
        'foo',
      ]);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], () => '', true, false, true, false, [
        'foo',
      ]);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], () => '', false, true, true, false, [
        'foo',
      ]);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], () => '', false, false, true, false, [
        'foo',
      ]);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
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
      expect(getAllError({ foo: 'error' }, {})).toEqual({ foo: 'error' });
      expect(
        getAllError(
          {},
          { foobar: { error: 'error', global: true, names: ['foo'] } },
        ),
      ).toEqual({ foo: 'error' });
      expect(
        getAllError(
          { foo: 'error' },
          { foobar: { error: 'error', global: true, names: ['foo'] } },
        ),
      ).toEqual({ foo: 'error' });
    });
  });

  describe('getData', () => {
    it('should return all form data', () => {
      input1.setAttribute('value', '42');
      input2.setAttribute('value', 'baz');
      expect(getData(new FormData(form))).toEqual({
        bar: 'baz',
        foo: '42',
      });
      expect(getData(new FormData(form), { foo: 42 })).toEqual({
        bar: 'baz',
        foo: 42,
      });
    });

    it('should return filtered form data', () => {
      input1.setAttribute('value', '42');
      input2.setAttribute('value', 'baz');
      expect(getData(new FormData(form), {}, ['foo'])).toEqual({ foo: '42' });
      expect(getData(new FormData(form), { foo: 42 }, ['foo'])).toEqual({
        foo: 42,
      });
    });
  });

  describe('getErrorObject', () => {
    it('should create the error object', () => {
      expect(getErrorObject({}, {})).toEqual({
        all: {},
        global: {},
        native: {},
        validator: {},
      });
      expect(getErrorObject({ foo: 'error' }, {})).toEqual({
        all: { foo: 'error' },
        global: {},
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
      expect(
        getErrorObject(
          {},
          { foobar: { error: 'error', global: true, names: ['foo'] } },
        ),
      ).toEqual({
        all: { foo: 'error' },
        global: { foobar: { error: 'error', global: true, names: ['foo'] } },
        main: { error: 'error', global: true, id: 'foobar', names: ['foo'] },
        native: {},
        validator: { foobar: { error: 'error', global: true, names: ['foo'] } },
      });
      expect(
        getErrorObject(
          { foo: 'error' },
          { foobar: { error: 'error', global: true, names: ['foo'] } },
        ),
      ).toEqual({
        all: { foo: 'error' },
        global: { foobar: { error: 'error', global: true, names: ['foo'] } },
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: { foobar: { error: 'error', global: true, names: ['foo'] } },
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

  describe('getNativeError', () => {
    it('should not return any error (valid)', () => {
      expect(getNativeError(input1, {})).toEqual('');
    });

    it('should return the native required error', () => {
      input1.setAttribute('required', '');
      expect(getNativeError(input1, {})).toEqual('Constraints not satisfied');
    });

    it('should return the custom required error', () => {
      input1.setAttribute('required', '');
      expect(
        getNativeError(input1, { valueMissing: 'Did you miss something ?' }),
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

  describe('getValidatorError', () => {
    it('should not return any error (no validators)', () => {
      expect(getValidatorError(form, [])).toEqual({});
    });

    it('should return the validator error', () => {
      const validators: [string, Set<ISetValidatorsParams>][] = [
        [
          'foo',
          new Set([
            {
              id: 'foo',
              names: ['foo'],
              validator: () => 'Custom error',
            },
          ]),
        ],
      ];
      expect(getValidatorError(form, validators)).toEqual({
        foo: { error: 'Custom error', global: true, names: ['foo'] },
      });
    });

    it('should not run the validator twice', () => {
      const validator = jest.fn(() => 'Custom error');
      const validators: [string, Set<ISetValidatorsParams>][] = [
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
      expect(getValidatorError(form, validators)).toEqual({
        foobar: { error: 'Custom error', global: true, names: ['foo', 'bar'] },
      });
      expect(validator).toHaveBeenCalledTimes(1);
    });
  });

  describe('getValidatorIds', () => {
    it('should return the id list of validators', () => {
      const validators: [string, Set<ISetValidatorsParams>][] = [
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
          native: { foo: 'error' },
          validator: {
            foobar: { error: 'error', global: true, names: ['foo'] },
          },
        }),
      ).toEqual({
        all: { foo: 'error' },
        global: { foobar: { error: 'error', global: true, names: ['foo'] } },
        main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
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
            native: { foo: 'prevError' },
            validator: {},
          },
          {
            all: { foo: 'error' },
            global: {
              foobar: { error: 'error', global: true, names: ['foo'] },
            },
            main: { error: 'error', global: false, id: 'foo', names: ['foo'] },
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
        native: { foo: 'error' },
        validator: { foobar: { error: 'error', global: true, names: ['foo'] } },
      });
    });
  });

  describe('setMainError', () => {
    it('should set the main error', () => {
      expect(
        setMainError({ global: {}, native: { foo: 'native' }, validator: {} }),
      ).toEqual({ error: 'native', global: false, id: 'foo', names: ['foo'] });
      expect(
        setMainError({
          global: {},
          native: { foo: 'native' },
          validator: {
            foo: { error: 'validator', global: false, names: ['foo'] },
          },
        }),
      ).toEqual({ error: 'native', global: false, id: 'foo', names: ['foo'] });
      expect(
        setMainError({
          global: {},
          native: { foo: '' },
          validator: {
            foo: { error: 'validator', global: false, names: ['foo'] },
          },
        }),
      ).toEqual({
        error: 'validator',
        global: false,
        id: 'foo',
        names: ['foo'],
      });
    });
  });

  describe('validateForm', () => {
    it('should validate the form (no error)', () => {
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      expect(
        validateForm(form, new Map(), formErrors, true, true, false),
      ).toEqual({
        all: { bar: '', foo: '', radio: '' },
        global: {},
        native: { bar: '', foo: '', radio: '' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { bar: '', foo: '', radio: '' },
        global: {},
        native: { bar: '', foo: '', radio: '' },
        validator: {},
      });
    });

    it('should return the required error', () => {
      input1.setAttribute('required', '');
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      expect(
        validateForm(form, new Map(), formErrors, true, true, false),
      ).toEqual({
        all: { bar: '', foo: 'Constraints not satisfied', radio: '' },
        global: {},
        main: {
          error: 'Constraints not satisfied',
          global: false,
          id: 'foo',
          names: ['foo'],
        },
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
        native: { bar: '', foo: 'Constraints not satisfied', radio: '' },
        validator: {},
      });
    });

    it('should return the required error with custom message', () => {
      input1.setAttribute('required', '');
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d(initialError) : d,
      );
      expect(
        validateForm(
          form,
          new Map(),
          formErrors,
          true,
          true,
          false,
          {},
          {
            valueMissing: 'Did you miss something ?',
          },
        ),
      ).toEqual({
        all: { bar: '', foo: 'Did you miss something ?', radio: '' },
        global: {},
        main: {
          error: 'Did you miss something ?',
          global: false,
          id: 'foo',
          names: ['foo'],
        },
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
        native: { bar: '', foo: 'Did you miss something ?', radio: '' },
        validator: {},
      });
    });

    it('should return the validator error', () => {
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
        validateForm(form, validators, formErrors, true, true, false),
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
        native: { bar: '', foo: '', radio: '' },
        validator: {
          foobar: {
            error: 'Custom error',
            global: true,
            names: ['foo', 'bar'],
          },
        },
      });
    });
  });
});
