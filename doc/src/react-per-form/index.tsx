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
} from 'rpf';

import { useCallback, useContext, useEffect } from 'react';
import { Form as RpfForm, useFormContext, useForm as useRpfForm } from 'rpf';

import { demoContext } from '../contexts/demo';

export type {
  IError,
  IFormContext,
  IFormMode,
  IFormReset,
  IFormRevalidateMode,
  IFormValues,
} from 'rpf';
export {
  Error,
  FormProvider,
  Reset,
  Submit,
  useFormContext,
  useFormErrors,
  useFormStates,
  useFormValid,
  useInput,
  useInputs,
  useSubscribe,
  useWatch,
} from 'rpf';

export function useForm(props: IUseFormProps = {}): IUseFormResult {
  const { onReset, onSubmit, ...rest } = props;
  const { renderCount, setDisplay, setErrors, setRenderCount, setValues } =
    useContext(demoContext);
  const { useNativeValidation = true } = rest;

  useEffect(() => {
    setRenderCount(renderCount.current + 1);
  });

  function handleReset(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
  ): IFormValues | null | undefined | void {
    setDisplay('none');
    return onReset?.(event, values);
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

  const result = useRpfForm({
    ...rest,
    onReset: handleReset,
    onSubmit: handleSubmit,
  });
  const { errors, onReset: onRpfReset, onSubmit: onRpfSubmit } = result;

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
      return onRpfReset(
        (event: FormEvent<HTMLFormElement>, values: IFormValues) => {
          setDisplay('none');
          return callback?.(event, values);
        },
      );
    },
    [onRpfReset, setDisplay],
  );

  const onSubmitHandler = useCallback(
    (validCallback?: ISubmitHandler, invalidCallback?: ISubmitErrorHandler) => {
      return onRpfSubmit(
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
    [onRpfSubmit, setDisplay, setValues],
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
  const { renderCount, setDisplay, setErrors, setRenderCount } =
    useContext(demoContext);
  const context = useFormContext();
  const { errors, useNativeValidation = true } = context;

  useEffect(() => {
    setRenderCount(renderCount.current + 1);
  });

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
  ): IFormValues | null | undefined | void {
    setDisplay('none');
    return onReset?.(event, values);
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
    <RpfForm {...rest} onReset={handleReset} onSubmit={handleSubmit}>
      <DemoForm>{children}</DemoForm>
    </RpfForm>
  );
}
