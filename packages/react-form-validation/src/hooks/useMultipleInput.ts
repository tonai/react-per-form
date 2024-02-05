import {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { formContext } from '../contexts';
import { createValidate } from '../helpers';
import { IError, IValidatorMultiple } from '../types';

export interface IUseMultipleInput {
  error?: string;
  errors: IError;
  refs: RefObject<Record<string, RefObject<HTMLInputElement>>>;
}

export function useMultipleInput(
  names: string[],
  validator?: IValidatorMultiple,
): IUseMultipleInput {
  const refs = useRef<Record<string, RefObject<HTMLInputElement>>>({}); // Object.fromEntries(names.map((name) => [name, { current: null }]))
  const {
    checkValidity,
    mode,
    removeValidator,
    setValidator,
    useNativeValidation,
    validateForm,
  } = useContext(formContext);
  const [errors, setErrors] = useState<IError>({});

  // const manageErrors = useCallback(
  //   (mode: IFormMode, newErrors: Record<string, string>, name: string) => {
  //     if (!showError) {
  //       setErrors((errors) => {
  //         if (
  //           mode === "check" ||
  //           mode === "change" ||
  //           (mode === "fix" && Object.keys(errors).length > 0)
  //         ) {
  //           return newErrors;
  //         }
  //         return errors;
  //       });
  //     } else if (mode === "check" || mode === "change") {
  //       refs.current[name].current?.reportValidity();
  //     }
  //   },
  //   [showError]
  // );

  const validate = useMemo(
    () =>
      createValidate(
        refs.current,
        names,
        useNativeValidation,
        setErrors,
        validator,
      ),
    [names, useNativeValidation, validator],
  );

  const reset = useCallback(() => {
    if (refs.current) {
      Object.values(refs.current).forEach((ref) => {
        if (ref.current) {
          ref.current.value = '';
        }
      });
    }
    setErrors({});
  }, []);

  // Synchronize refs and validator functions
  let mustValidate = false;
  const keys = Object.keys(refs.current);
  const allNames = useMemo(
    () => new Set(Object.keys(refs.current).concat(names)),
    [names],
  );
  allNames.forEach((name) => {
    if (!keys.includes(name)) {
      refs.current[name] = { current: null };
      setValidator(name, validate, reset);
      mustValidate = true;
    } else if (!names.includes(name)) {
      delete refs.current[name];
      removeValidator(name);
      mustValidate = true;
    } else {
      setValidator(name, validate, reset);
    }
  });

  // useEffect(() => {
  //   if (mustValidate) {
  //     validateForm("none");
  //   }
  // });
  if (mustValidate) {
    checkValidity(Object.keys(errors).length > 0 ? 'fix' : 'none');
  }

  useEffect(() => {
    if ((mode === 'check' || mode === 'blur') && refs.current) {
      const listeners = Object.entries(refs.current).map<
        [HTMLInputElement | null, () => void]
      >(([name, ref]) => {
        const eventHandler = () => validateForm('check', name);
        ref.current?.addEventListener('blur', eventHandler);
        return [ref.current, eventHandler];
      });
      return () =>
        listeners.forEach(([ref, eventHandler]) =>
          ref?.removeEventListener('blur', eventHandler),
        );
    }
  }, [mode, names, validateForm]);

  return { error: errors.main, errors, refs };
}
