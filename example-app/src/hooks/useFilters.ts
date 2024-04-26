import type { IFormMode, IFormRevalidateMode } from '@per-form/react';
import type { Dispatch, SetStateAction } from 'react';

import { useState } from 'react';

interface IUseFiltersResult {
  filtersProps: {
    mode: IFormMode;
    revalidateMode: IFormRevalidateMode;
    setMode: Dispatch<SetStateAction<IFormMode>>;
    setRevalidateMode: Dispatch<SetStateAction<IFormRevalidateMode>>;
    setUseNativeValidation: Dispatch<SetStateAction<boolean>>;
    useNativeValidation: boolean;
  };
  formData: {
    mode: IFormMode;
    revalidateMode: IFormRevalidateMode;
    useNativeValidation: boolean;
  };
}

export function useFilters(): IUseFiltersResult {
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
