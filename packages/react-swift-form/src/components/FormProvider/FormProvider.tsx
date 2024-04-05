import type { IFormContext } from '../../types';
import type { ReactElement, ReactNode } from 'react';

import { formContext } from '../../contexts';

export interface IFormProviderProps extends IFormContext {
  children: ReactNode;
}

export function FormProvider(props: IFormProviderProps): ReactElement {
  const { children, ...context } = props;
  return (
    <formContext.Provider value={context}>{children}</formContext.Provider>
  );
}
