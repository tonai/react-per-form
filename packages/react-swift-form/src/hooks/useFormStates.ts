import type { IFormStates } from '../types';

import { useContext, useState } from 'react';

import { formContext } from '../contexts';

import { useSubscribe } from './useSubscribe';

export function useFormStates(): IFormStates {
  const { states: initialStates } = useContext(formContext);
  const [states, setStates] = useState<IFormStates>(initialStates);
  useSubscribe((states) => setStates(states));
  return states;
}
