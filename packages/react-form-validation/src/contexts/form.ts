/* eslint-disable @typescript-eslint/no-empty-function */
import type { IFormContext } from '../types';

import { createContext } from 'react';

import { initialError } from '../constants';

export const formContext = createContext<IFormContext>({
  errors: initialError,
  mode: 'none',
  ref: { current: null },
  removeValidator() {},
  setValidator() {},
  subscribe() {
    return () => {};
  },
  useNativeValidation: true,
  validate() {
    return true;
  },
});
