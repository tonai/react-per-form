/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type {
  IError,
  IFormElement,
  IFormValidator,
  IFormValues,
  IMainError,
  IValidator,
  IValidatorError,
  IValidatorObject,
  IValidityMessages,
} from '../types';
import type { Dispatch, SetStateAction } from 'react';

import { intersection } from './array';
import { getFormInputs } from './form';

export function isValidator(
  validator?:
    | IValidator
    | IValidatorObject
    | Record<string, IValidator | IValidatorObject>,
): validator is IValidator {
  return typeof validator === 'function';
}

export function isValidatorObject(
  validator?:
    | IValidator
    | IValidatorObject
    | Record<string, IValidator | IValidatorObject>,
): validator is IValidatorObject {
  return Boolean(
    validator &&
      'names' in validator &&
      validator.names instanceof Array &&
      'validator' in validator &&
      typeof validator.validator === 'function',
  );
}

export function getNativeErrorKey(
  validity?: ValidityState,
): keyof ValidityState | null {
  if (!validity) {
    return null;
  }
  for (const key in validity) {
    if (
      key !== 'customError' &&
      key !== 'valid' &&
      validity[key as keyof typeof validity]
    ) {
      return key as keyof ValidityState;
    }
  }
  return null;
}

export function getData(formData: FormData, names: string[]): IFormValues {
  return Object.fromEntries(names.map((name) => [name, formData.get(name)]));
}

export function getFieldMessages(
  set: Set<IFormValidator>,
  messages: IValidityMessages = {},
): IValidityMessages {
  return Array.from(set).reduce<IValidityMessages>(
    (acc, params) => ({ ...acc, ...params.messages }),
    messages,
  );
}

export function getFilteredErrors<T>(
  errors: Record<string, T>,
  names?: string[],
): Record<string, T> {
  if (!names) {
    return errors;
  }
  return Object.fromEntries(
    Object.entries(errors).filter(([name]) => names.includes(name)),
  );
}

export function setMainError(
  errors: Omit<IError, 'all'>,
): IMainError | undefined {
  const native = Object.entries(errors.native).find(
    ([, error]) => error !== '',
  );
  if (native) {
    errors.main = {
      error: native[1],
      global: false,
      id: native[0],
      names: [native[0]],
    };
  } else {
    const validator = Object.entries(errors.validator).find(
      ([, { error }]) => error !== '',
    );
    if (validator) {
      errors.main = {
        error: validator[1].error,
        global: validator[1].global,
        id: validator[0],
        names: validator[1].names,
      };
    }
  }
  return errors.main;
}

export function getValidatorIds(
  validatorEntries: [string, Set<IFormValidator>][],
  names?: string[],
): string[] {
  const ids = new Set<string>();
  for (const [, set] of validatorEntries) {
    for (const params of set.values()) {
      const { id, names: fieldNames } = params;
      if (!names || intersection(names, fieldNames).length > 0) {
        ids.add(id);
      }
    }
  }
  return [...ids];
}

export function getAllError(
  nativeErrors: Record<string, string>,
  validatorErrors: Record<string, IValidatorError>,
): Record<string, string> {
  const all = Object.values(validatorErrors).reduce<Record<string, string>>(
    (acc, { error, names }) => {
      for (const name of names) {
        acc[name] ||= error;
      }
      return acc;
    },
    {},
  );
  for (const [name, value] of Object.entries(nativeErrors)) {
    if (value || !all[name]) {
      all[name] = value;
    }
  }
  return all;
}

export function getErrorObject(
  nativeErrors: Record<string, string>,
  validatorErrors: Record<string, IValidatorError>,
  names?: string[],
  ids?: string[],
): IError {
  const native = getFilteredErrors(nativeErrors, names);
  const validator = getFilteredErrors(validatorErrors, ids);
  const global = Object.fromEntries(
    Object.entries(validator).filter(([, { global }]) => global),
  );
  const all = getAllError(native, validator);
  const errors: IError = {
    all,
    global,
    native,
    validator,
  };
  setMainError(errors);
  return errors;
}

export function mergeErrors(prevErrors: IError, errors: IError): IError {
  const native = {
    ...prevErrors.native,
    ...errors.native,
  };
  const validator = {
    ...prevErrors.validator,
    ...errors.validator,
  };
  const all = getAllError(native, validator);
  const newErrors = {
    all,
    global: {
      ...prevErrors.global,
      ...errors.global,
    },
    native,
    validator,
  };
  setMainError(newErrors);
  return newErrors;
}

export function hasError(errors: IError): boolean {
  return Boolean(errors.main);
}

export function getFormInput(
  input: IFormElement,
): Exclude<IFormElement, RadioNodeList> {
  if (input instanceof RadioNodeList) {
    return input[0] as HTMLInputElement;
  }
  return input;
}

export function getNativeError(
  input: IFormElement,
  fieldMessages: IValidityMessages = {},
): string {
  input = getFormInput(input);
  input.setCustomValidity('');
  const { validity } = input;
  const validityKey = getNativeErrorKey(validity);
  if (validityKey) {
    const customMessage = fieldMessages[validityKey];
    if (customMessage) {
      input.setCustomValidity(customMessage);
    }
    return customMessage ?? input.validationMessage;
  }
  return '';
}

export function getValidatorError(
  form: HTMLFormElement,
  validatorEntries: [string, Set<IFormValidator>][],
): Record<string, IValidatorError> {
  const validatorErrors: Record<string, IValidatorError> = {};
  const formData = new FormData(form);

  for (const [, set] of validatorEntries) {
    for (const params of set.values()) {
      const { id, names: fieldNames, setErrors, validator } = params;
      if (id in validatorErrors || !validator) {
        continue;
      }
      const error = validator(getData(formData, fieldNames), fieldNames);
      for (const name of fieldNames) {
        // @ts-expect-error access HTMLFormControlsCollection with input name
        const input = getFormInput(form.elements[name] as IFormElement);
        if (input && error && !input.validationMessage) {
          input.setCustomValidity(error);
        }
      }
      validatorErrors[id] = { error, global: !setErrors, names: fieldNames };
    }
  }

  return validatorErrors;
}

export function focusError(inputs: IFormElement[], main?: IMainError): boolean {
  if (main) {
    const focusInput = inputs.find((input) =>
      main.names.includes(getFormInput(input).getAttribute('name') as string),
    );
    if (focusInput) {
      getFormInput(focusInput).focus();
      return true;
    }
  }
  return false;
}

export function displayErrors(
  errors: IError,
  form: HTMLFormElement,
  validatorEntries: [string, Set<IFormValidator>][],
  setErrors: Dispatch<SetStateAction<IError>>,
  display: boolean,
  revalidate: boolean,
  useNativeValidation: boolean,
  focusOnError?: boolean,
  names?: string[],
): void {
  const { native, validator } = errors;
  const inputs = getFormInputs(form);

  // Focus management
  let focus = false;
  function getFocus(): boolean {
    return focus;
  }
  function setFocus(value: boolean): void {
    focus = value;
  }

  // Native validation
  if (useNativeValidation) {
    if (!names) {
      if (display) {
        form.reportValidity();
      }
    } else if (errors.main && (display || revalidate)) {
      const name = errors.main.names[0];
      // @ts-expect-error access HTMLFormControlsCollection with input name
      const input = getFormInput(form.elements[name] as IFormElement);
      input.reportValidity();
    }
    return;
  }

  // Field errors
  for (const [name, set] of validatorEntries) {
    for (const params of set.values()) {
      if (names && !names.includes(name)) {
        continue;
      }
      const { id, names: fieldNames, setErrors } = params;
      if (setErrors) {
        setErrors((prevErrors) => {
          if (display || (revalidate && hasError(prevErrors))) {
            const fieldErrors = getErrorObject(native, validator, fieldNames, [
              id,
            ]);
            if (focusOnError && !getFocus()) {
              setFocus(focusError(inputs, fieldErrors.main));
            }
            return mergeErrors(prevErrors, fieldErrors);
          }
          return prevErrors;
        });
      }
    }
  }

  // Form errors
  setErrors((prevErrors) => {
    if (display || (revalidate && hasError(prevErrors))) {
      if (focusOnError && !getFocus()) {
        setFocus(focusError(inputs, errors.main));
      }
      return mergeErrors(prevErrors, errors);
    }
    return prevErrors;
  });
}

export function validateForm(
  form: HTMLFormElement,
  validatorMap: Map<string, Set<IFormValidator>>,
  setErrors: Dispatch<SetStateAction<IError>>,
  display: boolean,
  revalidate: boolean,
  useNativeValidation: boolean,
  messages?: IValidityMessages,
  focusOnError?: boolean,
  names?: string[],
): IError {
  const inputs = getFormInputs(form);
  const validatorEntries = Array.from(validatorMap.entries());
  const fieldMessages = Object.fromEntries(
    validatorEntries.map(([name, set]) => [
      name,
      getFieldMessages(set, messages),
    ]),
  );

  // Native errors
  const nativeErrors = inputs.reduce<Record<string, string>>((acc, input) => {
    const inputName = getFormInput(input).getAttribute('name') ?? '';
    acc[inputName] = getNativeError(
      input,
      fieldMessages[inputName] ?? messages,
    );
    return acc;
  }, {});

  // Custom validator errors
  const validatorErrors = getValidatorError(form, validatorEntries);

  // IError object
  const ids = getValidatorIds(validatorEntries, names);
  const errors = getErrorObject(nativeErrors, validatorErrors, names, ids);
  displayErrors(
    errors,
    form,
    validatorEntries,
    setErrors,
    display,
    revalidate,
    useNativeValidation,
    focusOnError,
    names,
  );

  return errors;
}
