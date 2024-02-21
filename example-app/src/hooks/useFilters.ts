import { FormEvent, useState } from 'react';
import { IFormMode, IFormRevalidateMode } from 'react-form-validation';

export function useFilters() {
  const [mode, setMode] = useState<IFormMode>('submit');
  const [revalidateMode, setRevalidateMode] =
    useState<IFormRevalidateMode>('submit');
  const [useNativeValidation, setUseNativeValidation] = useState(true);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('Submit!');
  }

  return {
    filtersProps: {
      mode,
      revalidateMode,
      setMode,
      setRevalidateMode,
      setUseNativeValidation,
      useNativeValidation,
    },
    hookProps: { mode, onSubmit, revalidateMode, useNativeValidation },
  };
}
