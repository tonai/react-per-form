/* eslint-disable @typescript-eslint/no-empty-function */
import type { IFormContext } from '../types';

import { createContext } from 'react';

import { initialError } from '../constants';

export const formContext = createContext<IFormContext>({
  errors: initialError,
  form: { current: null },
  mode: 'submit',
  onChange: () => () => null,
  onError: () => () => null,
  onReset: () => () => null,
  onSubmit: () => () => null,
  removeValidators() {},
  reset: () => null,
  revalidateMode: 'submit',
  setValidators() {},
  subscribe() {
    return () => {};
  },
  useNativeValidation: true,
  validate() {
    return [true, initialError];
  },
  watch: () => () => null,
});
