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
  register() {},
  reset: () => null,
  revalidateMode: 'submit',
  states: {
    valid: true,
  },
  subscribe() {
    return () => {};
  },
  unregister() {},
  useNativeValidation: true,
  validate() {
    return [true, initialError];
  },
  watch: () => () => null,
});
