import type {
  IError,
  IFormMode,
  IValidate,
  IValidatorMultiple,
  IValidityMessages,
} from '../types';
import type { Dispatch, RefObject, SetStateAction } from 'react';

export function getNativeError(
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

export function manageErrors(
  mode: IFormMode,
  newErrors: IError,
  ref: RefObject<HTMLInputElement>,
  setErrors: Dispatch<SetStateAction<IError>>,
  useNativeValidation: boolean,
): void {
  if (!useNativeValidation) {
    setErrors((errors) => {
      if (
        mode === 'check' ||
        mode === 'change' ||
        (mode === 'fix' && Object.keys(errors).length > 0)
      ) {
        return newErrors;
      }
      return errors;
    });
  } else if (mode === 'check' || mode === 'change') {
    ref.current?.reportValidity();
  }
}

export function createValidate(
  refs: Record<string, RefObject<HTMLInputElement>>,
  names: string[],
  useNativeValidation: boolean,
  setErrors: Dispatch<SetStateAction<IError>>,
  validator?: IValidatorMultiple,
  messages?: IValidityMessages,
): IValidate {
  return (mode: IFormMode, formData: FormData, name?: string) => {
    // Native errors
    const refArray = Object.entries(refs);
    const nativeErrors = refArray.reduce<Record<string, string>>(
      (acc, [name, ref]) => {
        if (!ref.current) {
          return acc;
        }
        ref.current.setCustomValidity('');
        const { validity } = ref.current;
        if (validity.valid) {
          return acc;
        }
        const validityKey = getNativeError(validity);
        if (validityKey) {
          const customMessage = messages?.[validityKey];
          if (customMessage) {
            ref.current.setCustomValidity(customMessage);
          }
          const message = customMessage ?? ref.current.validationMessage;
          if (message) {
            acc[name] = message;
          }
        }
        return acc;
      },
      {},
    );

    // Custom validator errors
    const hasNativeError = Object.keys(nativeErrors).length > 0;
    const refName = name ?? names[0];
    const validatorErrors: Record<string, string> = {};
    if (validator) {
      const error = validator(getData(formData, names), names);
      if (error) {
        if (!hasNativeError) {
          refs[refName].current?.setCustomValidity(error);
        }
        for (const name of names) {
          validatorErrors[name] = error;
        }
      } else {
        refs[refName].current?.setCustomValidity('');
      }
    }
    const hasValidatorError = Object.keys(validatorErrors).length > 0;

    // IError object
    const errors: IError = {};
    if (hasNativeError) {
      errors.native = nativeErrors;
    }
    if (hasValidatorError) {
      errors.validator = validatorErrors;
    }
    if (errors.native ?? errors.validator) {
      errors.all = Object.fromEntries(
        names
          .map((name) => [
            name,
            errors.native?.[name] ?? errors.validator?.[name],
          ])
          .filter(([_, error]) => error),
      ) as Record<string, string>;
    }
    if (errors.all) {
      const errorArray = Object.values(errors.all);
      if (name && errors.all[name]) {
        errors.main = errors.all[name];
      } else if (!name && errorArray.length > 0) {
        errors.main = errorArray[0];
      }
    }

    const errorName = errors.native
      ? Object.keys(errors.native)[0]
      : errors.validator
        ? Object.keys(errors.validator)[0]
        : refName;
    manageErrors(mode, errors, refs[errorName], setErrors, useNativeValidation);
  };
}
