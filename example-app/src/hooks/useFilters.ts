import { FormEvent, useState } from 'react';
import { IFormMode } from 'react-form-validation';

export function useFilters() {
  const [mode, setMode] = useState<IFormMode>('none');
  const [useNativeValidation, setUseNativeValidation] = useState(true);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('Submit!');
  }

  return {
    filtersProps: {
      mode,
      setMode,
      setUseNativeValidation,
      useNativeValidation,
    },
    hookProps: { mode, onSubmit, useNativeValidation },
  };
}
