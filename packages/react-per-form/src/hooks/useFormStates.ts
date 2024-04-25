import type { IFormStates } from '../types';

import { useContext, useState } from 'react';

import { formContext } from '../contexts';
import { getFieldStates } from '../helpers';

import { useSubscribe } from './useSubscribe';

export function useFormStates(names?: string[] | string): IFormStates {
  const { states: initialStates } = useContext(formContext);
  const [states, setStates] = useState<IFormStates>(
    names ? getFieldStates(initialStates, names) : initialStates,
  );
  useSubscribe((states) =>
    setStates(names ? getFieldStates(states, names) : states),
  );
  return states;
}
