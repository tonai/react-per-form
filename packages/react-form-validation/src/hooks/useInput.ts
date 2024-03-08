import type {
  IError,
  IMainError,
  IValidator,
  IValidatorObject,
  IValidityMessages,
} from '../types';

import { useMemo } from 'react';

import { useInputs } from './useInputs';

export interface IUseInputProps {
  id?: string;
  messages?: IValidityMessages;
  name: string;
  validators?:
    | IValidator
    | IValidatorObject
    | Record<string, IValidator | IValidatorObject>;
}

export interface IUseInputResult {
  error?: IMainError;
  errors: IError;
}

export function useInput(props: IUseInputProps): IUseInputResult {
  const { id, name, messages, validators } = props;

  const names = useMemo(() => [name], [name]);
  const { errors } = useInputs({
    id: id ?? name,
    messages,
    names,
    validators,
  });

  return { error: errors.main, errors };
}
