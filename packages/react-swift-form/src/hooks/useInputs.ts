import type {
  IError,
  IFormHandlers,
  IMainError,
  IMessages,
  ITransformers,
  IValidator,
  IValidatorObject,
} from '../types';

import { useContext, useEffect, useState } from 'react';

import { initialError } from '../constants';
import { formContext } from '../contexts';

export interface IUseInputsProps {
  defaultValues?: Record<string, unknown>;
  id?: string;
  messages?: IMessages;
  names: string[];
  onBlurOptOut?: string[] | string;
  onChangeOptOut?: string[] | string;
  transformers?: ITransformers;
  validators?:
    | IValidator
    | IValidatorObject
    | Record<string, IValidator | IValidatorObject>;
}

export interface IUseInputsResult extends IFormHandlers {
  error?: IMainError;
  errors: IError;
}

export function useInputs(props: IUseInputsProps): IUseInputsResult {
  const {
    defaultValues,
    id,
    messages,
    names,
    onBlurOptOut,
    onChangeOptOut,
    transformers,
    validators,
  } = props;

  const { onChange, onError, onReset, onSubmit, register, unregister, watch } =
    useContext(formContext);
  const [errors, setErrors] = useState<IError>(initialError);

  useEffect(() => {
    const params = {
      defaultValues,
      id: id ?? String(names),
      messages,
      names,
      onBlurOptOut,
      onChangeOptOut,
      setErrors,
      transformers,
      validators,
    };
    register(params);
    return () => unregister(params);
  }, [
    defaultValues,
    id,
    messages,
    names,
    onBlurOptOut,
    onChangeOptOut,
    register,
    transformers,
    unregister,
    validators,
  ]);

  return {
    error: errors.main,
    errors,
    onChange,
    onError,
    onReset,
    onSubmit,
    watch,
  };
}
