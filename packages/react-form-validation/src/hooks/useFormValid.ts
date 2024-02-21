import { useContext, useEffect, useState } from 'react';

import { formContext } from '../contexts';

export function useFormValid(): boolean {
  const { ref, subscribe } = useContext(formContext);
  const [isValid, setIsValid] = useState(Boolean(ref.current?.checkValidity()));
  useEffect(() => {
    return subscribe((form: HTMLFormElement | null) => {
      setIsValid(Boolean(form?.checkValidity()));
    });
  }, [subscribe]);
  return isValid;
}
