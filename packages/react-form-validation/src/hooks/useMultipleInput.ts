import type { IError, IValidatorMultiple, IValidityMessages } from '../types';
import type { RefObject } from 'react';

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { formContext } from '../contexts';
import { createValidate } from '../helpers';

export interface IUseMultipleInputProps {
  messages?: IValidityMessages;
  names: string[];
  validator?: IValidatorMultiple;
}

export interface IUseMultipleInputResult {
  error?: string;
  errors: IError;
  messages?: IValidityMessages;
  refs: RefObject<Record<string, RefObject<HTMLInputElement>>>;
}

export function useMultipleInput(
  props: IUseMultipleInputProps,
): IUseMultipleInputResult {
  const { names, messages, validator } = props;
  const refs = useRef<Record<string, RefObject<HTMLInputElement>>>({}); // Object.fromEntries(names.map((name) => [name, { current: null }]))
  const {
    checkValidity,
    messages: formMessages,
    mode,
    removeValidator,
    setValidator,
    useNativeValidation,
    validateForm,
  } = useContext(formContext);
  const [errors, setErrors] = useState<IError>({});
  const customMessages = useMemo(
    () => ({ ...formMessages, ...messages }),
    [formMessages, messages],
  );

  const validate = useMemo(
    () =>
      createValidate(
        refs.current,
        names,
        useNativeValidation,
        setErrors,
        validator,
        customMessages,
      ),
    [customMessages, names, useNativeValidation, validator],
  );

  const reset = useCallback(() => {
    Object.values(refs.current).forEach((ref) => {
      if (ref.current) {
        ref.current.value = '';
      }
    });
    setErrors({});
  }, []);

  // Synchronize refs and validator functions
  const keys = Object.keys(refs.current);
  const allNames = useMemo(
    () => [...new Set(Object.keys(refs.current).concat(names))],
    [names],
  );
  const mustValidate = allNames.some((name) => {
    if (!keys.includes(name)) {
      refs.current[name] = { current: null };
      setValidator(name, validate, reset);
      return true;
    } else if (!names.includes(name)) {
      delete refs.current[name];
      removeValidator(name);
      return true;
    }
    setValidator(name, validate, reset);
    return false;
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
    if (mode === 'check' || mode === 'blur') {
      const listeners = Object.entries(refs.current).map<
        [HTMLInputElement | null, () => void]
      >(([name, ref]) => {
        const eventHandler = (): boolean => validateForm('check', name);
        ref.current?.addEventListener('blur', eventHandler);
        return [ref.current, eventHandler];
      });
      return () =>
        listeners.forEach(([ref, eventHandler]) =>
          ref?.removeEventListener('blur', eventHandler),
        );
    }
    return undefined;
  }, [mode, names, validateForm]);

  return { error: errors.main, errors, refs };
}
