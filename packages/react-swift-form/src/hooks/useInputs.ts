import type {
  IError,
  IFormHandlers,
  IMainError,
  IMessages,
  IValidator,
  IValidatorObject,
} from '../types';

import { useContext, useEffect, useState } from 'react';

import { initialError } from '../constants';
import { formContext } from '../contexts';

export interface IUseInputsProps {
  id?: string;
  messages?: IMessages;
  names: string[];
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
  const { id, names, messages, validators } = props;

  const {
    onChange,
    onError,
    onReset,
    onSubmit,
    removeValidators,
    setValidators,
    watch,
  } = useContext(formContext);
  const [errors, setErrors] = useState<IError>(initialError);

  useEffect(() => {
    const params = {
      id: id ?? String(names),
      messages,
      names,
      setErrors,
      validators,
    };
    setValidators(params);
    return () => removeValidators(params);
  }, [id, messages, names, removeValidators, setValidators, validators]);

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
