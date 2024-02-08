import type {
  IError,
  IValidate,
  IValidatorMultiple,
  IValidityMessages,
} from '../types';
import type { Dispatch, SetStateAction } from 'react';

import { createValidate } from './validator';

export function insertInMapSet(
  map: Map<string, Set<unknown>>,
  name: string,
  x: unknown,
): void {
  if (!map.has(name)) {
    map.set(name, new Set([x]));
  } else {
    const set = map.get(name);
    set?.add(x);
  }
}

export function getFormValidate(
  form: HTMLFormElement,
  names: string[],
  useNativeValidation: boolean,
  setErrors: Dispatch<SetStateAction<IError>>,
  validator?: IValidatorMultiple,
  messages?: IValidityMessages,
): IValidate {
  return createValidate(
    Object.fromEntries(
      names.map((name) => [
        name,
        // @ts-expect-error access HTMLFormControlsCollection item with name
        { current: form.elements[name] as HTMLInputElement },
      ]),
    ),
    names,
    useNativeValidation,
    setErrors,
    validator,
    messages,
  );
}
