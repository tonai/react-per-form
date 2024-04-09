import type { Dispatch, SetStateAction } from 'react';
import type { IError, IFormValues } from 'react-swift-form';

import { createContext } from 'react';

export interface IDemoContext {
  setDisplay: Dispatch<SetStateAction<'error' | 'none' | 'value'>>;
  setErrors: (values: IError) => void;
  setValues: (values: IFormValues) => void;
}

export const demoContext = createContext<IDemoContext>({
  setDisplay: () => null,
  setErrors: () => null,
  setValues: () => null,
});
