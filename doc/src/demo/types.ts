import type { IFormMode, IFormRevalidateMode } from 'react-swift-form';

export interface IProps {
  filterLocalErrors?: boolean;
  mode?: IFormMode;
  revalidateMode?: IFormRevalidateMode;
  useNativeValidation?: boolean;
}
