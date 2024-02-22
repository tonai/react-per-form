import type { IError, ISetValidatorParams } from '../types';

import { initialError } from '../constants';

import {
  displayErrors,
  getAllError,
  getData,
  getErrorObject,
  getFieldMessages,
  getFilteredErrors,
  getNativeError,
  getNativeErrorKey,
  getValidatorError,
  getValidatorIds,
  hasError,
  mergeErrors,
  setMainError,
  validateForm,
} from './validator';

describe('validator helper', () => {
  let form: HTMLFormElement;
  let input1: HTMLInputElement;
  let input2: HTMLInputElement;

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
      const validators: [string, Set<ISetValidatorParams>][] = [
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
      displayErrors(errors, form, validators, formErrors, true, true, false, [
        'foo',
      ]);
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
      displayErrors(errors, form, validators, formErrors, true, false, false, [
        'foo',
      ]);
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
      displayErrors(errors, form, validators, formErrors, false, true, false, [
        'foo',
      ]);
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
      displayErrors(errors, form, validators, formErrors, false, false, false, [
        'foo',
      ]);
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
      displayErrors(errors, form, [], () => '', true, true, true, ['foo']);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], () => '', true, false, true, ['foo']);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], () => '', false, true, true, ['foo']);
      expect(spy).toHaveBeenCalled();
      spy.mockClear();
      displayErrors(errors, form, [], () => '', false, false, true, ['foo']);
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
    it('should return the form data', () => {
      input1.setAttribute('value', 'bar');
      expect(getData(new FormData(form), ['foo'])).toEqual({ foo: 'bar' });
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
      const validators: [string, Set<ISetValidatorParams>][] = [
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
      const validators: [string, Set<ISetValidatorParams>][] = [
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
      const validators: [string, Set<ISetValidatorParams>][] = [
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
        all: { bar: '', foo: '' },
        global: {},
        native: { bar: '', foo: '' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { bar: '', foo: '' },
        global: {},
        native: { bar: '', foo: '' },
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
        all: { bar: '', foo: 'Constraints not satisfied' },
        global: {},
        main: {
          error: 'Constraints not satisfied',
          global: false,
          id: 'foo',
          names: ['foo'],
        },
        native: { bar: '', foo: 'Constraints not satisfied' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { bar: '', foo: 'Constraints not satisfied' },
        global: {},
        main: {
          error: 'Constraints not satisfied',
          global: false,
          id: 'foo',
          names: ['foo'],
        },
        native: { bar: '', foo: 'Constraints not satisfied' },
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
        all: { bar: 'Custom error', foo: 'Custom error' },
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
        native: { bar: '', foo: '' },
        validator: {
          foobar: {
            error: 'Custom error',
            global: true,
            names: ['foo', 'bar'],
          },
        },
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { bar: 'Custom error', foo: 'Custom error' },
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
        native: { bar: '', foo: '' },
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
