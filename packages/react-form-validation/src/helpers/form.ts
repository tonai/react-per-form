import { Dispatch, SetStateAction } from 'react';
import { IError, IValidatorMultiple } from '../types';
import { createValidate } from './validator';

export function insertInMapSet(
  map: Map<string, Set<unknown>>,
  name: string,
  x: unknown,
) {
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
) {
  return createValidate(
    Object.fromEntries(
      // @ts-expect-error access HTMLFormControlsCollection item with name
      names.map((name) => [name, { current: form.elements[name] }]),
    ),
    names,
    useNativeValidation,
    setErrors,
    validator,
  );
}
