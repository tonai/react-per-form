import type { IError, ISetValidatorParams } from '../types';

import {
  displayErrors,
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
      const errors = { all: {}, native: {}, validator: {} };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d({ all: {}, native: {}, validator: {} }) : d,
      );
      displayErrors(errors, form, [], formErrors, 'check', false);
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        native: {},
        validator: {},
      });
    });

    it('should display the native errors (non native form validation)', () => {
      const errors = {
        all: {},
        native: { foo: 'error' },
        validator: {},
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d({ all: {}, native: {}, validator: {} }) : d,
      );
      displayErrors(errors, form, [], formErrors, 'check', false);
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        main: { error: 'error', id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
    });

    it('should display the native errors (non native input validation)', () => {
      const errors = {
        all: {},
        native: { foo: 'error' },
        validator: {},
      };
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d({ all: {}, native: {}, validator: {} }) : d,
      );
      const inputErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d({ all: {}, native: {}, validator: {} }) : d,
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
      displayErrors(errors, form, validators, formErrors, 'check', false);
      expect(inputErrors.mock.results[0].value).toEqual({
        all: { foo: 'error' },
        main: { error: 'error', id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: {},
        main: { error: 'error', id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
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
        native: {},
        validator: {},
      });
      expect(getErrorObject({ foo: 'error' }, {})).toEqual({
        all: { foo: 'error' },
        main: { error: 'error', id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: {},
      });
      expect(
        getErrorObject({}, { foobar: { error: 'error', names: ['foo'] } }),
      ).toEqual({
        all: { foo: 'error' },
        main: { error: 'error', id: 'foobar', names: ['foo'] },
        native: {},
        validator: { foobar: { error: 'error', names: ['foo'] } },
      });
      expect(
        getErrorObject(
          { foo: 'error' },
          { foobar: { error: 'error', names: ['foo'] } },
        ),
      ).toEqual({
        all: { foo: 'error' },
        main: { error: 'error', id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: { foobar: { error: 'error', names: ['foo'] } },
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
        foo: { error: 'Custom error', names: ['foo'] },
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
        foobar: { error: 'Custom error', names: ['foo', 'bar'] },
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
      expect(
        hasError({
          all: {},
          native: {},
          validator: {},
        }),
      ).toEqual(false);
      expect(
        hasError({
          all: { foo: 'error' },
          main: { error: 'error', id: 'foo', names: ['foo'] },
          native: { foo: 'error' },
          validator: {},
        }),
      ).toEqual(true);
    });
  });

  describe('mergeErrors', () => {
    it('should merge the error objects', () => {
      expect(
        mergeErrors(
          {
            all: {},
            native: {},
            validator: {},
          },
          {
            all: { foo: 'error' },
            main: { error: 'error', id: 'foo', names: ['foo'] },
            native: { foo: 'error' },
            validator: { foobar: { error: 'error', names: ['foo'] } },
          },
        ),
      ).toEqual({
        all: { foo: 'error' },
        main: { error: 'error', id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: { foobar: { error: 'error', names: ['foo'] } },
      });
      expect(
        mergeErrors(
          {
            all: { foo: 'error' },
            main: { error: 'error', id: 'foo', names: ['foo'] },
            native: { foo: 'error' },
            validator: { foobar: { error: 'error', names: ['foo'] } },
          },
          {
            all: {},
            native: {},
            validator: {},
          },
        ),
      ).toEqual({
        all: { foo: 'error' },
        main: { error: 'error', id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: { foobar: { error: 'error', names: ['foo'] } },
      });
      expect(
        mergeErrors(
          {
            all: { foo: 'prevError' },
            main: { error: 'prevError', id: 'foo', names: ['foo'] },
            native: { foo: 'prevError' },
            validator: {},
          },
          {
            all: { foo: 'error' },
            main: { error: 'error', id: 'foo', names: ['foo'] },
            native: { foo: 'error' },
            validator: { foobar: { error: 'error', names: ['foo'] } },
          },
        ),
      ).toEqual({
        all: { foo: 'error' },
        main: { error: 'error', id: 'foo', names: ['foo'] },
        native: { foo: 'error' },
        validator: { foobar: { error: 'error', names: ['foo'] } },
      });
    });
  });

  describe('setMainError', () => {
    it('should set the main error', () => {
      expect(
        setMainError({ native: { foo: 'native' }, validator: {} }),
      ).toEqual({ error: 'native', id: 'foo', names: ['foo'] });
      expect(
        setMainError({
          native: { foo: 'native' },
          validator: { foo: { error: 'validator', names: ['foo', 'bar'] } },
        }),
      ).toEqual({ error: 'native', id: 'foo', names: ['foo'] });
      expect(
        setMainError({
          native: { foo: '' },
          validator: { foo: { error: 'validator', names: ['foo', 'bar'] } },
        }),
      ).toEqual({ error: 'validator', id: 'foo', names: ['foo', 'bar'] });
    });
  });

  describe('validateForm', () => {
    it('should validate the form (no error)', () => {
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d({ all: {}, native: {}, validator: {} }) : d,
      );
      expect(validateForm(form, new Map(), formErrors, 'check', false)).toEqual(
        {
          all: { bar: '', foo: '' },
          native: { bar: '', foo: '' },
          validator: {},
        },
      );
      expect(formErrors.mock.results[0].value).toEqual({
        all: { bar: '', foo: '' },
        native: { bar: '', foo: '' },
        validator: {},
      });
    });

    it('should return the required error', () => {
      input1.setAttribute('required', '');
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d({ all: {}, native: {}, validator: {} }) : d,
      );
      expect(validateForm(form, new Map(), formErrors, 'check', false)).toEqual(
        {
          all: { bar: '', foo: 'Constraints not satisfied' },
          main: {
            error: 'Constraints not satisfied',
            id: 'foo',
            names: ['foo'],
          },
          native: { bar: '', foo: 'Constraints not satisfied' },
          validator: {},
        },
      );
      expect(formErrors.mock.results[0].value).toEqual({
        all: { bar: '', foo: 'Constraints not satisfied' },
        main: {
          error: 'Constraints not satisfied',
          id: 'foo',
          names: ['foo'],
        },
        native: { bar: '', foo: 'Constraints not satisfied' },
        validator: {},
      });
    });

    it('should return the validator error', () => {
      const formErrors = jest.fn((d: IError | ((error: IError) => IError)) =>
        typeof d === 'function' ? d({ all: {}, native: {}, validator: {} }) : d,
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
        validateForm(form, validators, formErrors, 'check', false),
      ).toEqual({
        all: { bar: 'Custom error', foo: 'Custom error' },
        main: {
          error: 'Custom error',
          id: 'foobar',
          names: ['foo', 'bar'],
        },
        native: { bar: '', foo: '' },
        validator: { foobar: { error: 'Custom error', names: ['foo', 'bar'] } },
      });
      expect(formErrors.mock.results[0].value).toEqual({
        all: { bar: 'Custom error', foo: 'Custom error' },
        main: {
          error: 'Custom error',
          id: 'foobar',
          names: ['foo', 'bar'],
        },
        native: { bar: '', foo: '' },
        validator: { foobar: { error: 'Custom error', names: ['foo', 'bar'] } },
      });
    });
  });
});
