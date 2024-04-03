/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type {
  IError,
  IFormElement,
  IFormValidator,
  IFormValues,
  IMainError,
  IMessages,
  IValidator,
  IValidatorError,
  IValidatorObject,
} from '../types';
import type { Dispatch, SetStateAction } from 'react';

import { intersection } from './array';
import { getFormInputs } from './form';
import { filterObject } from './object';

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

export function getFormInput(
  input: IFormElement,
): Exclude<IFormElement, RadioNodeList> {
  if (input instanceof RadioNodeList) {
    return input[0] as HTMLInputElement;
  }
  return input;
}

export function getInputValue(
  value: FormDataEntryValue,
  input?: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
): FormDataEntryValue | FormDataEntryValue[] {
  if (input && 'multiple' in input && input.multiple) {
    if (input.type === 'email') {
      return String(value)
        .split(',')
        .map((v) => v.trim());
    }
    return [value];
  }
  return value;
}

export function getData<V extends IFormValues>(
  form: HTMLFormElement,
  values: IFormValues = {},
  names?: string[],
): V {
  const formData = new FormData(form);
  const inputsMap = new Map(
    getFormInputs(form).map((input) => {
      input = getFormInput(input);
      return [input.getAttribute('name'), input];
    }),
  );
  const valuesMap = Array.from(formData.entries())
    .filter(([name]) => !names || names.includes(name))
    .reduce<Map<string, [string, FormDataEntryValue | FormDataEntryValue[]]>>(
      (acc, [name, value]) => {
        const mapTuple = acc.get(name);
        if (!mapTuple) {
          const input = inputsMap.get(name);
          acc.set(name, [name, getInputValue(value, input)]);
        } else {
          const val = mapTuple[1];
          const newVal: FormDataEntryValue[] =
            val instanceof Array ? val.concat(value) : [val, value];
          acc.set(name, [name, newVal]);
        }
        return acc;
      },
      new Map(),
    );
  return Object.fromEntries(
    Array.from(valuesMap.values()).map(([name, value]) => [
      name,
      name in values ? values[name] : value,
    ]),
  ) as V;
}

export function getFieldMessages(
  set: Set<IFormValidator>,
  messages: IMessages = {},
): IMessages {
  return Array.from(set).reduce<IMessages>(
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
  return filterObject<T>(errors, ([name]) => names.includes(name));
}

export function setMainError(
  errors: Omit<IError, 'all'>,
): IMainError | undefined {
  const native = Object.entries(errors.native).find(([, error]) => error);
  if (native) {
    errors.main = {
      error: native[1],
      global: false,
      id: native[0],
      names: [native[0]],
    };
  } else {
    const manual = Object.entries(errors.manual).find(([, error]) => error);
    if (manual) {
      errors.main = {
        error: manual[1] ?? '',
        global: false,
        id: manual[0],
        names: [manual[0]],
      };
    } else {
      const validator = Object.entries(errors.validator).find(
        ([, { error }]) => error,
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
  manualErrors: Record<string, string | null> = {},
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
  for (const [name, value] of Object.entries(manualErrors)) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (value || !all[name]) {
      all[name] = value ?? '';
    }
  }
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
  manualErrors: Record<string, string | null> = {},
  names?: string[],
  ids?: string[],
): IError {
  const native = getFilteredErrors(nativeErrors, names);
  const validator = getFilteredErrors(validatorErrors, ids);
  const manual = getFilteredErrors(manualErrors, names);
  const global = filterObject(validator, ([, { global }]) => global);
  const all = getAllError(native, validator, manual);
  const errors: IError = {
    all,
    global,
    manual,
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
  const manual = {
    ...prevErrors.manual,
    ...errors.manual,
  };
  const all = getAllError(native, validator, manual);
  const newErrors = {
    all,
    global: {
      ...prevErrors.global,
      ...errors.global,
    },
    manual,
    native,
    validator,
  };
  setMainError(newErrors);
  return newErrors;
}

export function hasError(errors: IError): boolean {
  return Boolean(errors.main);
}

export function getCustomMessage(
  error: string | null,
  messages: IMessages = {},
): string {
  if (!error) {
    return '';
  }
  return messages[error] ?? error;
}

export function getNativeError(
  input: IFormElement,
  fieldMessages: IMessages = {},
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

export function getManualError(
  form: HTMLFormElement,
  errors: Record<string, string | null> = {},
  fieldMessages: Record<string, IMessages> = {},
  messages?: IMessages,
): Record<string, string | null> {
  const manualErrors = Object.fromEntries(
    Object.entries(errors).map(([name, error]) => [
      name,
      getCustomMessage(error, fieldMessages[name] ?? messages),
    ]),
  );
  for (const [name, error] of Object.entries(manualErrors)) {
    // @ts-expect-error access HTMLFormControlsCollection with input name
    const input = getFormInput(form.elements[name] as IFormElement);
    if (input && error && !input.validationMessage) {
      input.setCustomValidity(error);
    }
  }
  return manualErrors;
}

export function getValidatorError(
  form: HTMLFormElement,
  validatorEntries: [string, Set<IFormValidator>][],
  values: IFormValues = {},
  fieldMessages: Record<string, IMessages> = {},
  messages?: IMessages,
): Record<string, IValidatorError> {
  const validatorErrors: Record<string, IValidatorError> = {};

  for (const [name, set] of validatorEntries) {
    for (const params of set.values()) {
      const { id, names: fieldNames, setErrors, validator } = params;
      if (id in validatorErrors || !validator) {
        continue;
      }
      const error = getCustomMessage(
        validator(getData(form, values, fieldNames), fieldNames),
        fieldMessages[name] ?? messages,
      );
      for (const fieldName of fieldNames) {
        // @ts-expect-error access HTMLFormControlsCollection with input name
        const input = getFormInput(form.elements[fieldName] as IFormElement);
        if (input && error && !input.validationMessage) {
          input.setCustomValidity(error);
        }
      }
      validatorErrors[id] = {
        error,
        global: !setErrors,
        names: fieldNames,
      };
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
  const { native, validator, manual } = errors;
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
            const fieldErrors = getErrorObject(
              native,
              validator,
              manual,
              fieldNames,
              [id],
            );
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
  values: IFormValues = {},
  manualErrors: Record<string, string | null> = {},
  messages?: IMessages,
  focusOnError?: boolean,
  names?: string[],
): IError {
  const validatorEntries = Array.from(validatorMap.entries());
  const fieldMessages = Object.fromEntries(
    validatorEntries.map(([name, set]) => [
      name,
      getFieldMessages(set, messages),
    ]),
  );

  // Native errors
  const inputs = getFormInputs(form);
  const nativeErrors = inputs.reduce<Record<string, string>>((acc, input) => {
    const inputName = getFormInput(input).getAttribute('name') ?? '';
    acc[inputName] = getNativeError(
      input,
      fieldMessages[inputName] ?? messages,
    );
    return acc;
  }, {});

  // Manual errors
  manualErrors = getManualError(form, manualErrors, fieldMessages, messages);

  // Custom validator errors
  const validatorErrors = getValidatorError(
    form,
    validatorEntries,
    values,
    fieldMessages,
    messages,
  );

  // IError object
  const ids = getValidatorIds(validatorEntries, names);
  const errors = getErrorObject(
    nativeErrors,
    validatorErrors,
    manualErrors,
    names,
    ids,
  );
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
