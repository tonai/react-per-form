import type { IFormContext } from '../types';

import { useContext } from 'react';

import { formContext } from '../contexts';

export function useFormContext(): IFormContext {
  return useContext(formContext);
}
