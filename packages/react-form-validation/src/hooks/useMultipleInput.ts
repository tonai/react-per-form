import type {
  IError,
  IMainError,
  IValidatorMultiple,
  IValidityMessages,
} from '../types';

import { useContext, useEffect, useState } from 'react';

import { formContext } from '../contexts';

export interface IUseMultipleInputProps {
  id?: string;
  messages?: IValidityMessages;
  names: string[];
  validator?: IValidatorMultiple;
}

export interface IUseMultipleInputResult {
  error?: IMainError;
  errors: IError;
}

export function useMultipleInput(
  props: IUseMultipleInputProps,
): IUseMultipleInputResult {
  const { id, names, messages, validator } = props;

  const { removeValidator, setValidator } = useContext(formContext);
  const [errors, setErrors] = useState<IError>({
    all: {},
    native: {},
    validator: {},
  });

  useEffect(() => {
    if (validator) {
      const params = {
        id: id ?? String(names),
        messages,
        names,
        setErrors,
        validator,
      };
      setValidator(params);
      return () => removeValidator(params);
    }
    return undefined;
  }, [id, messages, names, removeValidator, setValidator, validator]);

  return { error: errors.main, errors };
}
