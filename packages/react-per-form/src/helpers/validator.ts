/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type {
  IError,
  IFieldMessages,
  IFormElement,
  IFormValidator,
  IFormValues,
  ILocalFields,
  ILocalFormValidator,
  IMainError,
  IMessages,
  ITransformers,
  IValidator,
  IValidatorError,
  IValidatorObject,
} from '../types';
import type { Dispatch, SetStateAction } from 'react';

import { defaultSymbol, initialError } from '../constants';

import { intersection } from './array';
import { getFormInput, getFormInputs, getInputValue } from './form';
import { areObjectEquals, filterObject } from './object';

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

export function isLocalValidator(
  validator: IFormValidator,
): validator is ILocalFormValidator {
  return 'setErrors' in validator;
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
  validators: IFormValidator[],
  messages: IMessages = {},
): IFieldMessages {
  const fieldMessages: IFieldMessages = Object.fromEntries(
    validators.reduce<[string, IMessages][]>((acc, params) => {
      if (params.messages) {
        for (const name of params.names) {
          acc.push([name, params.messages]);
        }
      }
      return acc;
    }, []),
  );
  fieldMessages[defaultSymbol] = messages;
  return fieldMessages;
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
      } else {
        const global = Object.entries(errors.global).find(
          ([, { error }]) => error,
        );
        if (global) {
          errors.main = {
            error: global[1].error,
            global: global[1].global,
            id: global[0],
            names: global[1].names,
          };
        }
      }
    }
  }
  return errors.main;
}

export function getValidatorIds(
  validators: IFormValidator[],
  names?: string[],
): string[] {
  const ids = new Set<string>();
  for (const params of validators) {
    const { id, names: fieldNames } = params;
    if (!names || intersection(names, fieldNames).length > 0) {
      ids.add(id);
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
  global?: boolean;
  ids?: string[];
  manualErrors?: Record<string, string | null>;
  names?: string[];
  nativeErrors: Record<string, string>;
  validatorErrors: Record<string, IValidatorError>;
}

export function getErrorObject(params: IGetErrorObjectParams): IError {
  const {
    global = true,
    ids,
    manualErrors = {},
    names,
    nativeErrors,
    validatorErrors,
  } = params;
  const native = getFilteredErrors(nativeErrors, names);
  const validator = getFilteredErrors(validatorErrors, ids);
  const manual = getFilteredErrors(manualErrors, names);
  const errors: IError = {
    all: getAllError(native, validator, manual),
    global: global ? filterObject(validator, ([, { global }]) => global) : {},
    manual,
    native,
    validator,
  };
  setMainError(errors);
  return errors;
}

export function mergeErrors(prevErrors: IError, errors: IError): IError {
  const { global, validator } = errors;
  const native = {
    ...prevErrors.native,
    ...errors.native,
  };
  const manual = {
    ...prevErrors.manual,
    ...errors.manual,
  };
  const all = getAllError(native, validator, manual);
  const newErrors = {
    all,
    global,
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
  defaultMessages: IMessages = {},
): string {
  if (!error) {
    return '';
  }
  if (messages[error]) {
    return messages[error];
  }
  return defaultMessages[error] ?? error;
}

interface IGetNativeErrorParams {
  defaultMessages?: IMessages;
  input: IFormElement;
  messages?: IMessages;
}

export function getNativeError(params: IGetNativeErrorParams): string {
  const { defaultMessages = {}, input, messages = {} } = params;
  const formInput = getFormInput(input);
  formInput.setCustomValidity('');
  const { validity } = formInput;
  const validityKey = getNativeErrorKey(validity);
  if (validityKey) {
    const customMessage = messages[validityKey] ?? defaultMessages[validityKey];
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
      defaultMessages: fieldMessages[defaultSymbol],
      input,
      messages: fieldMessages[inputName],
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
  form: HTMLFormElement;
  transformers?: ITransformers;
  validators?: IFormValidator[];
  values?: IFormValues;
}

export function getValidatorError(
  params: IGetValidatorErrorParams,
): Promise<string[]> {
  const { form, transformers = {}, validators = [], values = {} } = params;

  const validatorResults = validators.map((params) => {
    const { names, validator } = params;
    if (!validator) {
      return '';
    }
    return validator(getData({ form, names, transformers, values }), names);
  });

  return Promise.all(Object.values(validatorResults));
}

interface ISetValidatorErrorParams {
  defaultMessages?: IMessages;
  form: HTMLFormElement;
  validatorResults: string[];
  validators: IFormValidator[];
}

export function setValidatorError(
  params: ISetValidatorErrorParams,
): Record<string, IValidatorError> {
  const { defaultMessages = {}, form, validatorResults, validators } = params;

  const validatorErrors: Record<string, IValidatorError> = {};
  validatorResults.forEach((result, i) => {
    const { id, messages, names } = validators[i];
    if (result) {
      const error = getCustomMessage(result, messages, defaultMessages);
      for (const fieldName of names) {
        // @ts-expect-error access HTMLFormControlsCollection with input name
        const input = getFormInput(form.elements[fieldName] as IFormElement);
        if (input && error && !input.validationMessage) {
          input.setCustomValidity(error);
        }
      }
      validatorErrors[id] = {
        error,
        global: !isLocalValidator(validators[i]),
        names,
      };
    }
  });

  return validatorErrors;
}

export function focusError(inputs: IFormElement[], main?: IMainError): boolean {
  if (main) {
    const focusInput = inputs.find((input) =>
      main.names.includes(getFormInput(input).name),
    );
    if (focusInput) {
      setTimeout(() => getFormInput(focusInput).focus());
      return true;
    }
  }
  return false;
}

interface IDisplayErrorParams {
  display: boolean;
  errors: IError;
  filterLocalErrors?: boolean;
  focusOnError?: boolean;
  form: HTMLFormElement;
  localFields?: ILocalFields;
  names?: string[];
  revalidate: boolean;
  setErrors: Dispatch<SetStateAction<IError>>;
  useNativeValidation: boolean;
  validators: IFormValidator[];
}

export function displayErrors(params: IDisplayErrorParams): void {
  const {
    display,
    errors,
    filterLocalErrors,
    focusOnError,
    form,
    localFields = {},
    names,
    revalidate,
    setErrors,
    useNativeValidation,
    validators,
  } = params;

  // Return quickly if there is no need to update the display
  if (!display && !revalidate) {
    return;
  }

  const { all, global, manual, native, validator } = errors;
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

  // Local fields
  const localNames = new Set<string>();
  for (const name of Object.keys(localFields)) {
    localNames.add(name);
  }
  const filterNames = Array.from(localNames);

  // Field errors
  const localErrors = new Map<Dispatch<SetStateAction<IError>>, IError>();
  // Local validators (native errors)
  for (const params of validators) {
    if (names && intersection(names, params.names).length === 0) {
      continue;
    }
    if (isLocalValidator(params)) {
      const {
        id,
        names: fieldNames,
        setErrors,
        validator: localValidator,
      } = params;
      if (!localValidator) {
        // 1. create error object for local fields with native errors
        localErrors.set(
          setErrors,
          getErrorObject({
            global: false,
            ids: [id],
            manualErrors: manual,
            names: fieldNames,
            nativeErrors: native,
            validatorErrors: validator,
          }),
        );
      } else if (validator[id]) {
        // 2. add local validator and manual error to local error
        const errors = localErrors.get(setErrors);
        if (errors) {
          errors.validator = { ...errors?.validator, [id]: validator[id] };
        }
      }
    } else {
      // Global validator
      const { id, names: fieldNames } = params;
      for (const name of fieldNames) {
        const localSetErrors = localFields[name];
        if (localSetErrors) {
          // 3. add global validator and manual errors to local error
          const errors = localErrors.get(localSetErrors);
          if (errors && validator[id]) {
            errors.validator = { ...errors?.validator, [id]: validator[id] };
          }
        }
      }
    }
  }
  for (const [setErrors, fieldErrors] of localErrors) {
    setMainError(fieldErrors);
    setErrors((prevErrors) => {
      if (display || (revalidate && hasError(prevErrors))) {
        if (focusOnError && !getFocus()) {
          setFocus(focusError(inputs, fieldErrors.main));
        }
        const mergedErrors = mergeErrors(prevErrors, fieldErrors);
        return !mergedErrors.main
          ? initialError
          : areObjectEquals(mergedErrors, prevErrors, true)
            ? prevErrors
            : mergedErrors;
      }
      return prevErrors;
    });
  }

  // Form errors
  setErrors((prevErrors) => {
    if (display || (revalidate && hasError(prevErrors))) {
      let globalErrors = errors;
      if (filterLocalErrors) {
        globalErrors = {
          all: filterObject(all, ([key]) => !filterNames.includes(key)),
          global,
          manual: filterObject(manual, ([key]) => !filterNames.includes(key)),
          native: filterObject(native, ([key]) => !filterNames.includes(key)),
          validator: filterObject(
            validator,
            ([, { names }]) =>
              intersection(filterNames, names).length !== names.length,
          ),
        };
        setMainError(globalErrors);
      }
      if (focusOnError && !getFocus()) {
        setFocus(focusError(inputs, globalErrors.main));
      }
      const mergedErrors = mergeErrors(prevErrors, globalErrors);
      return !mergedErrors.main
        ? initialError
        : areObjectEquals(mergedErrors, prevErrors, true)
          ? prevErrors
          : mergedErrors;
    }
    return prevErrors;
  });
}

interface IValidateFormParams {
  display: boolean;
  errors?: Record<string, string | null>;
  filterLocalErrors?: boolean;
  focusOnError?: boolean;
  form: HTMLFormElement;
  localFields?: ILocalFields;
  messages?: IMessages;
  names?: string[];
  revalidate: boolean;
  setErrors: Dispatch<SetStateAction<IError>>;
  transformers?: ITransformers;
  useNativeValidation: boolean;
  validators: IFormValidator[];
  values?: IFormValues;
}

export async function validateForm(
  params: IValidateFormParams,
): Promise<IError> {
  const {
    display,
    errors = {},
    filterLocalErrors,
    focusOnError,
    form,
    localFields,
    messages,
    names,
    revalidate,
    setErrors,
    transformers = {},
    useNativeValidation,
    validators,
    values = {},
  } = params;
  const fieldMessages: IFieldMessages = getFieldMessages(validators, messages);

  // 1. run validator.
  const validatorResults = await getValidatorError({
    form,
    transformers,
    validators,
    values,
  });

  // 2. native errors.
  const nativeErrors = getNativeErrors({ fieldMessages, form });

  // 3. manual errors.
  const manualErrors = getManualError({
    errors,
    fieldMessages,
    form,
  });

  // 4. validator errors.
  const validatorErrors = setValidatorError({
    defaultMessages: messages,
    form,
    validatorResults,
    validators,
  });

  // IError object
  const ids = getValidatorIds(validators, names);
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
    filterLocalErrors,
    focusOnError,
    form,
    localFields,
    names,
    revalidate,
    setErrors,
    useNativeValidation,
    validators,
  });

  return errorObject;
}
