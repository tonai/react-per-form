import { useContext, useState } from 'react';

import { formContext } from '../contexts';

import { useSubscribe } from './useSubscribe';

export function useFormValid(): boolean {
  const { form } = useContext(formContext);
  const [isValid, setIsValid] = useState(
    Boolean(form.current?.checkValidity()),
  );
  useSubscribe(({ form }) => setIsValid(Boolean(form?.checkValidity())));
  return isValid;
}
