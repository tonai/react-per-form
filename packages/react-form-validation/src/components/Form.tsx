import { ReactNode } from 'react';
import { formContext } from '../contexts';
import { IUseFormProps, useForm } from '../hooks';

type FormProps = JSX.IntrinsicElements['form'];

export interface IFormProps extends IUseFormProps, FormProps {
  children: ReactNode;
}

export function Form(props: IFormProps) {
  const {
    children,
    onSubmit,
    mode = 'none',
    useNativeValidation = true,
    validators,
    ...restProps
  } = props;
  const { formProps, ...context } = useForm({
    onSubmit,
    mode,
    useNativeValidation,
    validators,
  });

  return (
    <formContext.Provider value={context}>
      <form {...restProps} {...formProps}>
        {children}
      </form>
    </formContext.Provider>
  );
}
