import { Dispatch, RefObject, SetStateAction } from 'react';
import { IError, IFormMode, IValidatorMultiple } from '../types';

export function validityHasNativeError(validity?: ValidityState): boolean {
  if (!validity) {
    return false;
  }
  for (const key in validity) {
    return key !== 'customError' && validity[key as keyof typeof validity];
  }
  return false;
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
) {
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
) {
  return (mode: IFormMode, formData: FormData, name?: string) => {
    // Native errors
    const refArray = Object.entries(refs);
    const nativeErrors = refArray.reduce<Record<string, string>>(
      (acc, [name, ref]) => {
        if (validityHasNativeError(ref.current?.validity)) {
          ref.current?.setCustomValidity('');
          const message = ref.current?.validationMessage;
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
    const refName = name || names[0];
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
    if (errors.native || errors.validator) {
      errors.all = Object.fromEntries(
        names
          .map((name) => [
            name,
            errors.native?.[name] || errors.validator?.[name],
          ])
          .filter(([_, error]) => error),
      );
    }
    if (errors.all) {
      const errorArray = Object.values(errors.all);
      if (name && errors.all[name]) {
        errors.main = errors.all[name];
      } else if (!name && errorArray.length > 0) {
        errors.main = errorArray[0];
      }
    }

    manageErrors(mode, errors, refs[refName], setErrors, useNativeValidation);
  };
}
