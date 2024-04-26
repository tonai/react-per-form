import type { IFormMode, IFormRevalidateMode } from '@per-form/react';

export interface IProps {
  filterLocalErrors?: boolean;
  mode?: IFormMode;
  revalidateMode?: IFormRevalidateMode;
  useNativeValidation?: boolean;
}
