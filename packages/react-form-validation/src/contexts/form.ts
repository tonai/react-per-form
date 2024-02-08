/* eslint-disable @typescript-eslint/no-empty-function */
import type { IFormContext } from '../types';

import { createContext } from 'react';

export const formContext = createContext<IFormContext>({
  checkValidity() {},
  errors: {},
  isValid: true,
  mode: 'none',
  removeValidator() {},
  resetForm() {},
  setValidator() {},
  useNativeValidation: true,
  validateForm() {
    return true;
  },
});
