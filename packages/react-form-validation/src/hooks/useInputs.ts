import type {
  IError,
  IMainError,
  IValidator,
  IValidatorObject,
  IValidityMessages,
} from '../types';

import { useContext, useEffect, useState } from 'react';

import { initialError } from '../constants';
import { formContext } from '../contexts';

export interface IUseInputsProps {
  id?: string;
  messages?: IValidityMessages;
  names: string[];
  validators?:
    | IValidator
    | IValidatorObject
    | Record<string, IValidator | IValidatorObject>;
}

export interface IUseInputsResult {
  error?: IMainError;
  errors: IError;
}

export function useInputs(props: IUseInputsProps): IUseInputsResult {
  const { id, names, messages, validators } = props;

  const context = useContext(formContext);
  const { removeValidators, setValidators } = context;
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

  return { error: errors.main, errors };
}
