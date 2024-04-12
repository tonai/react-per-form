import type { IUseInputsResult } from './useInputs';
import type {
  IError,
  IMainError,
  IMessages,
  IValidator,
  IValidatorObject,
} from '../types';

import { useMemo } from 'react';

import { useInputs } from './useInputs';

export interface IUseInputProps {
  defaultValue?: unknown;
  id?: string;
  messages?: IMessages;
  name: string;
  onChangeOptOut?: boolean;
  transformer?: (value: unknown) => unknown;
  validator?: IValidator | IValidatorObject;
}

export interface IUseInputResult extends IUseInputsResult {
  error?: IMainError;
  errors: IError;
}

export function useInput(props: IUseInputProps): IUseInputResult {
  const {
    defaultValue,
    id,
    messages,
    name,
    onChangeOptOut,
    transformer,
    validator,
  } = props;

  const names = useMemo(() => [name], [name]);
  const defaultValues = useMemo(
    () => (defaultValue !== undefined ? { [name]: defaultValue } : undefined),
    [defaultValue, name],
  );
  const transformers = useMemo(
    () => (transformer !== undefined ? { [name]: transformer } : undefined),
    [name, transformer],
  );
  const { errors, ...rest } = useInputs({
    defaultValues,
    id: id ?? name,
    messages,
    names,
    onChangeOptOut: onChangeOptOut ? name : undefined,
    transformers,
    validators: validator,
  });

  return { ...rest, error: errors.main, errors };
}
