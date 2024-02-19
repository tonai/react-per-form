import type {
  IError,
  IFormValues,
  IMainError,
  IValidator,
  IValidatorMultiple,
  IValidityMessages,
} from '../types';

import { useMemo } from 'react';

import { useInputs } from './useInputs';

export interface IUseInputProps {
  id?: string;
  messages?: IValidityMessages;
  name: string;
  validator?: IValidator;
}

export interface IUseInputResult {
  error?: IMainError;
  errors: IError;
}

export function useInput(props: IUseInputProps): IUseInputResult {
  const { id, name, messages, validator } = props;

  const validatorMultiple: IValidatorMultiple | undefined = useMemo(() => {
    if (validator) {
      return (values: IFormValues) => validator(values[name], name);
    }
    return undefined;
  }, [name, validator]);
  const names = useMemo(() => [name], [name]);
  const { errors } = useInputs({
    id: id ?? name,
    messages,
    names,
    validator: validatorMultiple,
  });

  return { error: errors.main, errors };
}
