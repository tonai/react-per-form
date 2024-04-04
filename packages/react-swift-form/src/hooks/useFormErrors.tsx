import type { IError } from '../types';

import { useContext } from 'react';

import { formContext } from '../contexts';

export function useFormErrors(): IError {
  const { errors } = useContext(formContext);
  return errors;
}
