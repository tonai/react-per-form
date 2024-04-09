import type { FormEvent, ReactElement } from 'react';
import type {
  IFormProps,
  IFormReset,
  IFormValues,
  IResetHandler,
  ISubmitErrorHandler,
  ISubmitHandler,
  IUseFormProps,
  IUseFormResult,
} from 'rsf';

import { useCallback, useContext, useEffect } from 'react';
import { Form as RsfForm, useFormContext, useForm as useRsfForm } from 'rsf';

import { demoContext } from '../contexts/demo';

export type {
  IError,
  IFormContext,
  IFormMode,
  IFormReset,
  IFormRevalidateMode,
  IFormValues,
} from 'rsf';
export {
  Error,
  FormProvider,
  Reset,
  Submit,
  useFormContext,
  useFormErrors,
  useFormValid,
  useInput,
  useInputs,
  useSubscribe,
  useWatch,
} from 'rsf';

export function useForm(props: IUseFormProps = {}): IUseFormResult {
  const { onReset, onSubmit, ...rest } = props;
  const { setDisplay, setErrors, setValues } = useContext(demoContext);
  const { useNativeValidation = true } = rest;

  function handleReset(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
  ): void {
    onReset?.(event, values);
    setDisplay('none');
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
    reset: IFormReset,
  ): void {
    onSubmit?.(event, values, reset);
    setValues(values);
    setDisplay('value');
  }

  const result = useRsfForm({
    ...rest,
    onReset: handleReset,
    onSubmit: handleSubmit,
  });
  const { errors, onReset: onRsfReset, onSubmit: onRsfSubmit } = result;

  useEffect(() => {
    if (!useNativeValidation) {
      setErrors(errors);
      setDisplay((display) =>
        errors.main ? 'error' : display === 'value' ? 'value' : 'none',
      );
    }
  }, [errors, setDisplay, setErrors, useNativeValidation]);

  const onResetHandler = useCallback(
    (callback?: IResetHandler) => {
      return onRsfReset(
        (event: FormEvent<HTMLFormElement>, values: IFormValues) => {
          callback?.(event, values);
          setDisplay('none');
        },
      );
    },
    [onRsfReset, setDisplay],
  );

  const onSubmitHandler = useCallback(
    (validCallback?: ISubmitHandler, invalidCallback?: ISubmitErrorHandler) => {
      return onRsfSubmit(
        (
          event: FormEvent<HTMLFormElement>,
          values: IFormValues,
          reset: IFormReset,
        ) => {
          validCallback?.(event, values, reset);
          setValues(values);
          setDisplay('value');
        },
        invalidCallback,
      );
    },
    [onRsfSubmit, setDisplay, setValues],
  );

  return {
    ...result,
    onReset: onResetHandler,
    onSubmit: onSubmitHandler,
  };
}

export function DemoForm(
  props: Pick<IFormProps, 'children'>,
): ReactElement | null {
  const { children } = props;
  const { setDisplay, setErrors } = useContext(demoContext);
  const context = useFormContext();
  const { errors, useNativeValidation = true } = context;

  useEffect(() => {
    if (!useNativeValidation) {
      setErrors(errors);
      setDisplay((display) =>
        errors.main ? 'error' : display === 'value' ? 'value' : 'none',
      );
    }
  }, [errors, setDisplay, setErrors, useNativeValidation]);

  return <>{typeof children === 'function' ? children(context) : children}</>;
}

export function Form(props: IFormProps): ReactElement {
  const { children, onReset, onSubmit, ...rest } = props;
  const { setDisplay, setValues } = useContext(demoContext);

  function handleReset(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
  ): void {
    onReset?.(event, values);
    setDisplay('none');
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
    reset: IFormReset,
  ): void {
    onSubmit?.(event, values, reset);
    setValues(values);
    setDisplay('value');
  }

  return (
    <RsfForm {...rest} onReset={handleReset} onSubmit={handleSubmit}>
      <DemoForm>{children}</DemoForm>
    </RsfForm>
  );
}
