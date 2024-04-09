import type { IFormMode, IFormRevalidateMode } from 'react-swift-form';

export interface IProps {
  mode?: IFormMode;
  revalidateMode?: IFormRevalidateMode;
  useNativeValidation?: boolean;
}
