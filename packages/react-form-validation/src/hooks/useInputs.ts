import type {
  IError,
  IMainError,
  IValidatorMultiple,
  IValidityMessages,
} from '../types';

import { useContext, useEffect, useState } from 'react';

import { initialError } from '../constants';
import { formContext } from '../contexts';

export interface IUseInputsProps {
  id?: string;
  messages?: IValidityMessages;
  names: string[];
  validator?: IValidatorMultiple;
}

export interface IUseInputsResult {
  error?: IMainError;
  errors: IError;
}

export function useInputs(props: IUseInputsProps): IUseInputsResult {
  const { id, names, messages, validator } = props;

  const { removeValidator, setValidator } = useContext(formContext);
  const [errors, setErrors] = useState<IError>(initialError);

  useEffect(() => {
    const params = {
      id: id ?? String(names),
      messages,
      names,
      setErrors,
      validator,
    };
    setValidator(params);
    return () => removeValidator(params);
  }, [id, messages, names, removeValidator, setValidator, validator]);

  return { error: errors.main, errors };
}
