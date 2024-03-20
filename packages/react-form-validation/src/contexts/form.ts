/* eslint-disable @typescript-eslint/no-empty-function */
import type { IFormContext } from '../types';

import { createContext } from 'react';

import { initialError } from '../constants';

export const formContext = createContext<IFormContext>({
  errors: initialError,
  mode: 'submit',
  onChange: () => () => null,
  onError: () => () => null,
  onSubmit: () => () => null,
  ref: { current: null },
  removeValidators() {},
  revalidateMode: 'submit',
  setValidators() {},
  subscribe() {
    return () => {};
  },
  useNativeValidation: true,
  validate() {
    return [true, initialError];
  },
});
