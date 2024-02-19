/* eslint-disable @typescript-eslint/no-empty-function */
import type { IFormContext } from '../types';

import { createContext } from 'react';

export const formContext = createContext<IFormContext>({
  // checkValidity() {},
  errors: { all: {}, native: {}, validator: {} },
  // isValid: true,
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
