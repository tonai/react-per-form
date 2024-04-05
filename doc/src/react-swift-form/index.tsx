import type { FormEvent, ReactElement } from 'react';
import type {
  IFormProps,
  IFormValues,
  IUseFormProps,
  IUseFormResult,
} from 'rsf';

import { useContext, useEffect } from 'react';
import { Form as RsfForm, useFormContext, useForm as useRsfForm } from 'rsf';

import { demoContext } from '../contexts/demo';

export type { IError, IFormContext, IFormValues } from 'rsf';
export {
  FormProvider,
  useFormErrors,
  useFormValid,
  useInput,
  useInputs,
  useSubscribe,
  useWatch,
} from 'rsf';

export function useForm(props: IUseFormProps = {}): IUseFormResult {
  const { onSubmit, ...rest } = props;
  const { setDisplay, setErrors, setValues } = useContext(demoContext);
  const { useNativeValidation = true } = rest;

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
  ): void {
    onSubmit?.(event, values);
    setValues(values);
    setDisplay('value');
  }

  const result = useRsfForm({
    ...rest,
    onSubmit: handleSubmit,
  });
  const { errors } = result;

  useEffect(() => {
    if (!useNativeValidation && errors.main) {
      setErrors(errors);
      setDisplay('error');
    }
  }, [errors, setDisplay, setErrors, useNativeValidation]);

  return result;
}

export function DemoForm(
  props: Pick<IFormProps, 'children'>,
): ReactElement | null {
  const { children } = props;
  const { setDisplay, setErrors } = useContext(demoContext);
  const context = useFormContext();
  const { errors, useNativeValidation = true } = context;

  useEffect(() => {
    if (!useNativeValidation && errors.main) {
      setErrors(errors);
      setDisplay('error');
    }
  }, [errors, setDisplay, setErrors, useNativeValidation]);

  return <>{typeof children === 'function' ? children(context) : children}</>;
}

export function Form(props: IFormProps): ReactElement {
  const { children, onSubmit, ...rest } = props;
  const { setDisplay, setValues } = useContext(demoContext);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
  ): void {
    onSubmit?.(event, values);
    setValues(values);
    setDisplay('value');
  }

  return (
    <RsfForm {...rest} onSubmit={handleSubmit}>
      <DemoForm>{children}</DemoForm>
    </RsfForm>
  );
}
