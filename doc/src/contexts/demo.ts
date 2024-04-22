import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import type { IError, IFormValues } from 'react-swift-form';

import { createContext } from 'react';

export interface IDemoContext {
  renderCount: MutableRefObject<number>;
  setDisplay: Dispatch<SetStateAction<'error' | 'none' | 'value'>>;
  setErrors: (values: IError) => void;
  setRenderCount: (values: number) => void;
  setValues: (values: IFormValues) => void;
  subscribe: (subscriber: (value: number) => void) => void;
}

export const demoContext = createContext<IDemoContext>({
  renderCount: { current: 0 },
  setDisplay: () => null,
  setErrors: () => null,
  setRenderCount: () => null,
  setValues: () => null,
  subscribe: () => null,
});
