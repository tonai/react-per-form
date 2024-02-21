import type { IMainError, IValidatorError } from '../types';

export function isMainError<T>(error: IMainError | T): error is IMainError {
  return error instanceof Object && 'id' in error;
}

export function isValidatorError<T>(
  error: IValidatorError | T,
): error is IValidatorError {
  return error instanceof Object && !isMainError(error) && 'error' in error;
}
