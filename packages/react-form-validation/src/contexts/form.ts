import { createContext } from 'react';
import { IFormContext } from '../types';

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
