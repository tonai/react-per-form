import type { IFormMode, IFormRevalidateMode } from 'react-per-form';

export interface IProps {
  filterLocalErrors?: boolean;
  mode?: IFormMode;
  revalidateMode?: IFormRevalidateMode;
  useNativeValidation?: boolean;
}
