import type { IUseFormProps } from '../../hooks';
import type { IFormContext } from '../../types';
import type { ReactElement, ReactNode } from 'react';

import { useForm } from '../../hooks';
import { FormProvider } from '../FormProvider/FormProvider';

type IElementProps = JSX.IntrinsicElements['form'];

export interface IFormProps
  extends IUseFormProps,
    Omit<IElementProps, 'children' | 'onReset' | 'onSubmit'> {
  children: ReactNode | ((data: IFormContext) => ReactNode);
}

export function Form(props: IFormProps): ReactElement {
  const {
    children,
    defaultValues,
    filterLocalErrors,
    messages,
    mode,
    onBlurOptOut,
    onChangeOptOut,
    onReset,
    onSubmit,
    onSubmitError,
    revalidateMode,
    transformers,
    useNativeValidation = true,
    validators,
    ...restProps
  } = props;
  const { formProps, ...context } = useForm({
    defaultValues,
    filterLocalErrors,
    messages,
    mode,
    onBlurOptOut,
    onChangeOptOut,
    onReset,
    onSubmit,
    onSubmitError,
    revalidateMode,
    transformers,
    useNativeValidation,
    validators,
  });

  return (
    <FormProvider {...context}>
      <form data-testid="rpf-form" {...restProps} {...formProps}>
        {typeof children === 'function' ? children(context) : children}
      </form>
    </FormProvider>
  );
}
