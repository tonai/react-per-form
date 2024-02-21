/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type {
  IError,
  IMainError,
  ISetValidatorParams,
  IValidatorError,
  IValidityMessages,
} from '../types';
import type { Dispatch, SetStateAction } from 'react';

import { intersection } from './array';
import { getFormInputs } from './form';

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

export function getData(
  formData: FormData,
  names: string[],
): Record<string, FormDataEntryValue | null> {
  return Object.fromEntries(names.map((name) => [name, formData.get(name)]));
}

export function getFieldMessages(
  set: Set<ISetValidatorParams>,
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
    errors.main = { error: native[1], id: native[0], names: [native[0]] };
  } else {
    const validator = Object.entries(errors.validator).find(
      ([, { error }]) => error !== '',
    );
    if (validator) {
      errors.main = {
        error: validator[1].error,
        id: validator[0],
        names: validator[1].names,
      };
    }
  }
  return errors.main;
}

export function getValidatorIds(
  validatorEntries: [string, Set<ISetValidatorParams>][],
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

export function getErrorObject(
  nativeErrors: Record<string, string>,
  validatorErrors: Record<string, IValidatorError>,
  names?: string[],
  ids?: string[],
): IError {
  const native = getFilteredErrors(nativeErrors, names);
  const validator = getFilteredErrors(validatorErrors, ids);
  const all = Object.values(validator).reduce<Record<string, string>>(
    (acc, { error, names }) => {
      for (const name of names) {
        acc[name] ||= error;
      }
      return acc;
    },
    {},
  );
  for (const [name, value] of Object.entries(native)) {
    if (value || !all[name]) {
      all[name] = value;
    }
  }
  const errors: IError = {
    all,
    native,
    validator,
  };
  setMainError(errors);
  return errors;
}

export function mergeErrors(prevErrors: IError, errors: IError): IError {
  const newErrors = {
    all: {
      ...prevErrors.all,
      ...errors.all,
    },
    native: {
      ...prevErrors.native,
      ...errors.native,
    },
    validator: {
      ...prevErrors.validator,
      ...errors.validator,
    },
  };
  setMainError(newErrors);
  return newErrors;
}

export function hasError(errors: IError): boolean {
  return Boolean(errors.main);
}

export function getNativeError(
  input: HTMLInputElement,
  fieldMessages: IValidityMessages = {},
): string {
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
  validatorEntries: [string, Set<ISetValidatorParams>][],
): Record<string, IValidatorError> {
  const validatorErrors: Record<string, IValidatorError> = {};
  const formData: FormData = new FormData(form);

  for (const [name, set] of validatorEntries) {
    for (const params of set.values()) {
      const { id, names: fieldNames, validator } = params;
      if (id in validatorErrors || !validator) {
        continue;
      }
      const error = validator(getData(formData, fieldNames), fieldNames);
      // @ts-expect-error access HTMLFormControlsCollection with input name
      const input = form.elements[name] as HTMLInputElement;
      if (!input.validationMessage && error) {
        input.setCustomValidity(error);
      }
      validatorErrors[id] = { error, names: fieldNames };
    }
  }

  return validatorErrors;
}

export function displayErrors(
  errors: IError,
  form: HTMLFormElement,
  validatorEntries: [string, Set<ISetValidatorParams>][],
  setErrors: Dispatch<SetStateAction<IError>>,
  display: boolean,
  revalidate: boolean,
  useNativeValidation: boolean,
  names?: string[],
): void {
  const { native, validator } = errors;

  // Native validation
  if (useNativeValidation) {
    if (!names) {
      if (display) {
        form.reportValidity();
      }
    } else if (errors.main && (display || revalidate)) {
      const name = errors.main.names[0];
      // @ts-expect-error access HTMLFormControlsCollection with input name
      const input = form.elements[name] as HTMLInputElement;
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
            return mergeErrors(
              prevErrors,
              getErrorObject(native, validator, fieldNames, [id]),
            );
          }
          return prevErrors;
        });
      }
    }
  }

  // Global form errors
  setErrors((prevErrors) => {
    if (display || (revalidate && hasError(prevErrors))) {
      return mergeErrors(prevErrors, errors);
    }
    return prevErrors;
  });
}

export function validateForm(
  form: HTMLFormElement,
  validatorMap: Map<string, Set<ISetValidatorParams>>,
  setErrors: Dispatch<SetStateAction<IError>>,
  display: boolean,
  revalidate: boolean,
  useNativeValidation: boolean,
  messages?: IValidityMessages,
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
    const inputName = input.getAttribute('name') ?? '';
    acc[inputName] = getNativeError(input, fieldMessages[inputName]);
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
    names,
  );
  return errors;
}
