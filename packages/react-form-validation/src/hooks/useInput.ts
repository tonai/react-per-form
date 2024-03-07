import type {
  IError,
  IMainError,
  IValidator,
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

  const names = useMemo(() => [name], [name]);
  const { errors } = useInputs({
    id: id ?? name,
    messages,
    names,
    validator,
  });

  return { error: errors.main, errors };
}
