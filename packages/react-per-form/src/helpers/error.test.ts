import type { IMainError, IValidatorError } from '../types';

import { isMainError, isValidatorError } from './error';

describe('array helper', () => {
  describe('isMainError', () => {
    it('should return true if params is IMainError otherwise false', () => {
      expect(
        isMainError({
          error: 'error',
          global: false,
          id: 'foo',
          names: ['foo'],
        } as IMainError),
      ).toEqual(true);
      expect(isMainError({})).toEqual(false);
      expect(
        isMainError({
          error: 'error',
          global: false,
          names: ['foo'],
        } as IValidatorError),
      ).toEqual(false);
    });
  });

  describe('isValidatorError', () => {
    it('should return true if params is IValidatorError otherwise false', () => {
      expect(
        isValidatorError({
          error: 'error',
          global: false,
          names: ['foo'],
        } as IValidatorError),
      ).toEqual(true);
      expect(isMainError({})).toEqual(false);
      expect(
        isValidatorError({
          error: 'error',
          global: false,
          id: 'foo',
          names: ['foo'],
        } as IMainError),
      ).toEqual(false);
    });
  });
});
