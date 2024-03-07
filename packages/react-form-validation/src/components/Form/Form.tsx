import type { IUseFormProps } from '../../hooks';
import type { ReactElement, ReactNode } from 'react';

import { formContext } from '../../contexts';
import { useForm } from '../../hooks';

type IElementProps = JSX.IntrinsicElements['form'];

export interface IFormProps
  extends IUseFormProps,
    Omit<IElementProps, 'onSubmit'> {
  children: ReactNode;
}

export function Form(props: IFormProps): ReactElement {
  const {
    children,
    messages,
    mode,
    onSubmit,
    revalidateMode,
    useNativeValidation = true,
    validators,
    ...restProps
  } = props;
  const { formProps, ...context } = useForm({
    messages,
    mode,
    onSubmit,
    revalidateMode,
    useNativeValidation,
    validators,
  });

  return (
    <formContext.Provider value={context}>
      <form data-testid="rfv-form" {...restProps} {...formProps}>
        {children}
      </form>
    </formContext.Provider>
  );
}
