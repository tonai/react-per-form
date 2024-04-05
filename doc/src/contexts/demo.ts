import type { IError, IFormValues } from 'react-swift-form';

import { createContext } from 'react';

export interface IDemoContext {
  setDisplay: (display: 'error' | 'value') => void;
  setErrors: (values: IError) => void;
  setValues: (values: IFormValues) => void;
}

export const demoContext = createContext<IDemoContext>({
  setDisplay: () => null,
  setErrors: () => null,
  setValues: () => null,
});
