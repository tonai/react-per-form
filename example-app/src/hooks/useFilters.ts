import { useState } from 'react';
import { IFormMode, IFormRevalidateMode } from 'react-swift-form';

export function useFilters() {
  const [mode, setMode] = useState<IFormMode>('submit');
  const [revalidateMode, setRevalidateMode] =
    useState<IFormRevalidateMode>('submit');
  const [useNativeValidation, setUseNativeValidation] = useState(true);

  return {
    filtersProps: {
      mode,
      revalidateMode,
      setMode,
      setRevalidateMode,
      setUseNativeValidation,
      useNativeValidation,
    },
    formData: { mode, revalidateMode, useNativeValidation },
  };
}
