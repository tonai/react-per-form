/* eslint-disable @typescript-eslint/no-empty-function */
import type { IFormContext } from '../types';

import { createContext } from 'react';

import { initialError, initialStates } from '../constants';

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
    ...initialStates,
    changedFields: [],
    dirtyFields: [],
    isChanged: false,
    isDirty: false,
    isPristine: true,
    isReady: false,
    isSubmitted: false,
    isTouched: false,
    isValid: true,
    touchedFields: [],
  },
  subscribe() {
    return () => {};
  },
  unregister() {},
  useNativeValidation: true,
  validate() {
    return Promise.resolve([true, initialError]);
  },
  watch: () => () => null,
});
