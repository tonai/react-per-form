import type {
  IFormValues,
  IValidator,
  IValidatorMultiple,
  IValidityMessages,
} from '../types';
import type { RefObject } from 'react';

import { useMemo } from 'react';

import { useMultipleInput } from './useMultipleInput';

export interface IUseInputProps {
  messages?: IValidityMessages;
  name: string;
  validator?: IValidator;
}

export interface IUseInputResult {
  error?: string;
  ref: RefObject<HTMLInputElement>;
}

export function useInput(props: IUseInputProps): IUseInputResult {
  const { name, messages, validator } = props;
  const validatorMultiple: IValidatorMultiple | undefined = useMemo(() => {
    if (validator) {
      return (values: IFormValues) => validator(values[name], name);
    }
    return undefined;
  }, [name, validator]);
  const { errors, refs } = useMultipleInput({
    messages,
    names: [name],
    validator: validatorMultiple,
  });
  return {
    error: errors.main,
    ref: refs.current?.[name] ?? { current: null },
  };
}
