import type { IError } from '../types';

import {
  createValidate,
  getData,
  getNativeError,
  manageErrors,
} from './validator';

describe('validator helper', () => {
  let form: HTMLFormElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    form = document.createElement('form');
    input = document.createElement('input');
    input.setAttribute('name', 'foo');
    input.setAttribute('value', '');
    form.appendChild(input);
  });

  describe('createValidate', () => {
    it('should validate the form', () => {
      const validator = createValidate(
        { foo: { current: input } },
        ['foo'],
        true,
        () => null,
      );
      const errors = validator('none', new FormData(form));
      expect(errors).toEqual({});
    });

    it('should not validate the form (required)', () => {
      input.setAttribute('required', '');
      const validator = createValidate(
        { foo: { current: input } },
        ['foo'],
        true,
        () => null,
      );
      const errors = validator('none', new FormData(form));
      expect(errors).toEqual({
        all: { foo: 'Constraints not satisfied' },
        main: 'Constraints not satisfied',
        native: { foo: 'Constraints not satisfied' },
      });
    });
  });

  describe('getData', () => {
    it('should return the form data', () => {
      input.setAttribute('value', 'bar');
      expect(getData(new FormData(form), ['foo'])).toEqual({ foo: 'bar' });
    });
  });

  describe('getNativeError', () => {
    it('should not return any error', () => {
      expect(getNativeError(input.validity)).toEqual(null);
    });

    it('should return the form native error (required)', () => {
      input.setAttribute('required', '');
      expect(getNativeError(input.validity)).toEqual('valueMissing');
    });
  });

  describe('manageErrors', () => {
    it('should not display the native error (mode is "none")', () => {
      jest.spyOn(input, 'reportValidity');
      manageErrors(
        'none',
        {
          all: { foo: 'Constraints not satisfied' },
          main: 'Constraints not satisfied',
          native: { foo: 'Constraints not satisfied' },
        },
        { current: input },
        () => null,
        true,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(input.reportValidity).not.toHaveBeenCalled();
    });

    it('should display the native error (mode is "check")', () => {
      jest.spyOn(input, 'reportValidity');
      manageErrors(
        'check',
        {
          all: { foo: 'Constraints not satisfied' },
          main: 'Constraints not satisfied',
          native: { foo: 'Constraints not satisfied' },
        },
        { current: input },
        () => null,
        true,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(input.reportValidity).toHaveBeenCalled();
    });

    it('should not update the error (mode is "none")', () => {
      const spy = jest.fn((updater: IError | ((error: IError) => IError)) =>
        typeof updater === 'function' ? updater({}) : updater,
      );
      manageErrors(
        'none',
        {
          all: { foo: 'Constraints not satisfied' },
          main: 'Constraints not satisfied',
          native: { foo: 'Constraints not satisfied' },
        },
        { current: input },
        spy,
        false,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(spy.mock.results[0].value).toEqual({});
    });

    it('should update the error (mode is "check")', () => {
      const spy = jest.fn((updater: IError | ((error: IError) => IError)) =>
        typeof updater === 'function' ? updater({}) : updater,
      );
      manageErrors(
        'check',
        {
          all: { foo: 'Constraints not satisfied' },
          main: 'Constraints not satisfied',
          native: { foo: 'Constraints not satisfied' },
        },
        { current: input },
        spy,
        false,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(spy.mock.results[0].value).toEqual({
        all: { foo: 'Constraints not satisfied' },
        main: 'Constraints not satisfied',
        native: { foo: 'Constraints not satisfied' },
      });
    });
  });
});
