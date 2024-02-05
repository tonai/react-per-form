import { RefObject, useMemo } from 'react';
import { IFormValues, IValidator, IValidatorMultiple } from '../types';
import { useMultipleInput } from './useMultipleInput';

export interface IUseInput {
  error?: string;
  ref: RefObject<HTMLInputElement>;
}

export function useInput(name: string, validator?: IValidator): IUseInput {
  const validatorMultiple: IValidatorMultiple | undefined = useMemo(() => {
    if (validator) {
      return (values: IFormValues) => validator(values[name], name);
    }
  }, [name, validator]);
  const { errors, refs } = useMultipleInput([name], validatorMultiple);
  return {
    error: errors.main,
    ref: refs.current![name],
  };
}
