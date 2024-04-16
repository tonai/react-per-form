/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type {
  IError,
  IFieldMessages,
  IFormElement,
  IFormValidator,
  IFormValues,
  IMainError,
  IMessages,
  ITransformers,
  IValidator,
  IValidatorError,
  IValidatorObject,
} from '../types';
import type { Dispatch, SetStateAction } from 'react';

import { defaultSymbol } from '../constants';

import { intersection } from './array';
import { getFormInputs, getInputValue } from './form';
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

interface IGetDataParams {
  form: HTMLFormElement;
  names?: string[];
  transformers?: ITransformers;
  values?: IFormValues;
}

export function getData<V extends IFormValues>(params: IGetDataParams): V {
  const { form, names, transformers = {}, values = {} } = params;
  const formData = new FormData(form);
  const inputsMap = new Map(
    getFormInputs(form).map((input) => {
      input = getFormInput(input);
      return [input.name, input];
    }),
  );
  const keys = Array.from(
    new Set(Object.keys(values).concat(Array.from(formData.keys()))),
  );
  const vals = keys
    .filter((name) => !names || names.includes(name))
    .reduce<IFormValues>((acc, name) => {
      if (values[name] !== undefined) {
        acc[name] = values[name];
      } else {
        const input = inputsMap.get(name);
        acc[name] = input ? getInputValue(input) : formData.get(name);
      }
      if (transformers[name]) {
        acc[name] = transformers[name](acc[name]);
      }
      return acc;
    }, {}) as V;
  return vals;
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

interface IGetErrorObjectParams {
  ids?: string[];
  manualErrors?: Record<string, string | null>;
  names?: string[];
  nativeErrors: Record<string, string>;
  validatorErrors: Record<string, IValidatorError>;
}

export function getErrorObject(params: IGetErrorObjectParams): IError {
  const {
    ids,
    manualErrors = {},
    names,
    nativeErrors,
    validatorErrors,
  } = params;
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

interface IGetNativeErrorParams {
  input: IFormElement;
  messages?: IMessages;
}

export function getNativeError(params: IGetNativeErrorParams): string {
  const { input, messages = {} } = params;
  const formInput = getFormInput(input);
  formInput.setCustomValidity('');
  const { validity } = formInput;
  const validityKey = getNativeErrorKey(validity);
  if (validityKey) {
    const customMessage = messages[validityKey];
    if (customMessage) {
      formInput.setCustomValidity(customMessage);
    }
    return customMessage ?? formInput.validationMessage;
  }
  return '';
}

interface IGetNativeErrorsParams {
  fieldMessages: IFieldMessages;
  form: HTMLFormElement;
}

export function getNativeErrors(
  params: IGetNativeErrorsParams,
): Record<string, string> {
  const { fieldMessages, form } = params;
  const inputs = getFormInputs(form);
  return inputs.reduce<Record<string, string>>((acc, input) => {
    const inputName = getFormInput(input).name ?? '';
    acc[inputName] = getNativeError({
      input,
      messages: fieldMessages[inputName] ?? fieldMessages[defaultSymbol],
    });
    return acc;
  }, {});
}

interface IGetManualError {
  errors?: Record<string, string | null>;
  fieldMessages?: IFieldMessages;
  form: HTMLFormElement;
}

export function getManualError(
  params: IGetManualError,
): Record<string, string | null> {
  const { errors = {}, fieldMessages = {}, form } = params;
  const manualErrors = Object.fromEntries(
    Object.entries(errors).map(([name, error]) => [
      name,
      getCustomMessage(
        error,
        fieldMessages[name] ?? fieldMessages[defaultSymbol],
      ),
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

interface IGetValidatorErrorParams {
  fieldMessages?: IFieldMessages;
  form: HTMLFormElement;
  transformers?: ITransformers;
  validatorEntries?: [string, Set<IFormValidator>][];
  values?: IFormValues;
}

interface IValidatorParams extends IFormValidator {
  name: string;
}

export async function getValidatorError(
  params: IGetValidatorErrorParams,
): Promise<Record<string, IValidatorError>> {
  const {
    fieldMessages = {},
    form,
    transformers = {},
    validatorEntries = [],
    values = {},
  } = params;

  const validatorParams: IValidatorParams[] = [];
  const validatorResults: Record<string, Promise<string> | string> = {};
  for (const [name, set] of validatorEntries) {
    for (const params of set.values()) {
      const { id, names, validator } = params;
      if (!validator || id in validatorResults) {
        continue;
      }
      validatorParams.push({ ...params, name });
      validatorResults[id] = validator(
        getData({ form, names, transformers, values }),
        names,
      );
    }
  }

  const validatorErrors: Record<string, IValidatorError> = {};
  (await Promise.all(Object.values(validatorResults))).forEach((result, i) => {
    const { id, names, name, setErrors } = validatorParams[i];
    const error = getCustomMessage(
      result,
      fieldMessages[name] ?? fieldMessages[defaultSymbol],
    );
    for (const fieldName of names) {
      // @ts-expect-error access HTMLFormControlsCollection with input name
      const input = getFormInput(form.elements[fieldName] as IFormElement);
      if (input && error && !input.validationMessage) {
        input.setCustomValidity(error);
      }
    }
    validatorErrors[id] = {
      error,
      global: !setErrors,
      names,
    };
  });

  return validatorErrors;
}

export function focusError(inputs: IFormElement[], main?: IMainError): boolean {
  if (main) {
    const focusInput = inputs.find((input) =>
      main.names.includes(getFormInput(input).name),
    );
    if (focusInput) {
      getFormInput(focusInput).focus();
      return true;
    }
  }
  return false;
}

interface IDisplayErrorParams {
  display: boolean;
  errors: IError;
  focusOnError?: boolean;
  form: HTMLFormElement;
  names?: string[];
  revalidate: boolean;
  setErrors: Dispatch<SetStateAction<IError>>;
  useNativeValidation: boolean;
  validatorEntries: [string, Set<IFormValidator>][];
}

export function displayErrors(params: IDisplayErrorParams): void {
  const {
    display,
    errors,
    focusOnError,
    form,
    names,
    revalidate,
    setErrors,
    useNativeValidation,
    validatorEntries,
  } = params;
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
            const fieldErrors = getErrorObject({
              ids: [id],
              manualErrors: manual,
              names: fieldNames,
              nativeErrors: native,
              validatorErrors: validator,
            });
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

interface IValidateFormParams {
  display: boolean;
  errors?: Record<string, string | null>;
  focusOnError?: boolean;
  form: HTMLFormElement;
  messages?: IMessages;
  names?: string[];
  revalidate: boolean;
  setErrors: Dispatch<SetStateAction<IError>>;
  transformers?: ITransformers;
  useNativeValidation: boolean;
  validatorMap: Map<string, Set<IFormValidator>>;
  values?: IFormValues;
}

export async function validateForm(
  params: IValidateFormParams,
): Promise<IError> {
  const {
    display,
    errors = {},
    focusOnError,
    form,
    messages,
    names,
    revalidate,
    setErrors,
    transformers = {},
    useNativeValidation,
    validatorMap,
    values = {},
  } = params;
  const validatorEntries = Array.from(validatorMap.entries());
  const fieldMessages: IFieldMessages = Object.fromEntries(
    validatorEntries.map(([name, set]) => [
      name,
      getFieldMessages(set, messages),
    ]),
  );
  fieldMessages[defaultSymbol] = messages ?? {};

  // 1. native errors.
  const nativeErrors = getNativeErrors({ fieldMessages, form });

  // 2. manual errors.
  const manualErrors = getManualError({
    errors,
    fieldMessages,
    form,
  });

  // 3. validator errors.
  const validatorErrors = await getValidatorError({
    fieldMessages,
    form,
    transformers,
    validatorEntries,
    values,
  });

  // IError object
  const ids = getValidatorIds(validatorEntries, names);
  const errorObject = getErrorObject({
    ids,
    manualErrors,
    names,
    nativeErrors,
    validatorErrors,
  });

  displayErrors({
    display,
    errors: errorObject,
    focusOnError,
    form,
    names,
    revalidate,
    setErrors,
    useNativeValidation,
    validatorEntries,
  });

  return errorObject;
}
