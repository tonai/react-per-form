/* eslint-disable @typescript-eslint/no-empty-function */
import type { IFormContext } from '../types';

import { createContext } from 'react';

import { initialError } from '../constants';

export const formContext = createContext<IFormContext>({
  errors: initialError,
  mode: 'submit',
  ref: { current: null },
  removeValidator() {},
  revalidateMode: 'submit',
  setValidator() {},
  subscribe() {
    return () => {};
  },
  useNativeValidation: true,
  validate() {
    return true;
  },
});
