import { useContext, useState } from 'react';

import { formContext } from '../contexts';

import { useSubscribe } from './useSubscribe';

export function useFormValid(): boolean {
  const { ref } = useContext(formContext);
  const [isValid, setIsValid] = useState(Boolean(ref.current?.checkValidity()));
  useSubscribe(({ form }) => setIsValid(Boolean(form?.checkValidity())));
  return isValid;
}
