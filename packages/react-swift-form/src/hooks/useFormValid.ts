import { useContext, useState } from 'react';

import { formContext } from '../contexts';

import { useSubscribe } from './useSubscribe';

export function useFormValid(): boolean {
  const { states } = useContext(formContext);
  const [isValid, setIsValid] = useState(states.isValid);
  useSubscribe(({ states }) => setIsValid(states.isValid));
  return isValid;
}
