import type {
  IError,
  IFormContext,
  IFormMode,
  IFormRevalidateMode,
  IFormValidator,
  ISetValidatorParams,
  ISubscriber,
  IValidatorMultiple,
  IValidityMessages,
} from '../types';
import type { FormEvent, RefObject } from 'react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { initialError } from '../constants';
import { getFormInputs, getValidatorMap, validateForm } from '../helpers';

export interface IUseFormProps {
  messages?: IValidityMessages;
  mode?: IFormMode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  revalidateMode?: IFormRevalidateMode;
  useNativeValidation?: boolean;
  validators?:
    | IFormValidator[]
    | Record<string, IFormValidator | IValidatorMultiple>;
}

export interface IUseFormResult extends IFormContext {
  formProps: {
    noValidate: boolean;
    onChange: (event: FormEvent<HTMLFormElement>) => void;
    onReset: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    ref: RefObject<HTMLFormElement>;
  };
}

export function useForm(props: IUseFormProps = {}): IUseFormResult {
  const {
    onSubmit,
    messages,
    mode = 'submit',
    revalidateMode = 'submit',
    useNativeValidation = true,
    validators,
  } = props;
  const ref = useRef<HTMLFormElement>(null);
  const fields = useRef<Set<ISetValidatorParams>>(new Set());
  const [errors, setErrors] = useState<IError>(initialError);

  // Observer
  const subscribers = useRef<ISubscriber[]>([]);
  const subscribe = useCallback((subscriber: ISubscriber) => {
    if (!subscribers.current.includes(subscriber)) {
      subscribers.current.push(subscriber);
    }
    return () =>
      subscribers.current.slice(subscribers.current.indexOf(subscriber), 1);
  }, []);
  const notify = useCallback(() => {
    subscribers.current.forEach((subscriber) => subscriber(ref.current));
  }, []);

  const validate = useCallback(
    (display = false, revalidate = false, names?: string[] | string | null) => {
      if (!ref.current) {
        return false;
      }

      // field validation
      const validatorMap = getValidatorMap(
        fields.current,
        validators,
        messages,
      );

      // Validate
      validateForm(
        ref.current,
        validatorMap,
        setErrors,
        display,
        revalidate,
        useNativeValidation,
        messages,
        names instanceof Array ? names : names ? [names] : undefined,
      );

      notify();
      return Boolean(ref.current.checkValidity());
    },
    [messages, notify, useNativeValidation, validators],
  );

  const timer = useRef<NodeJS.Timeout>();
  const debouncedValidate = useCallback(
    (
      display?: boolean,
      revalidate?: boolean,
      names?: string[] | string | null,
    ) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => validate(display, revalidate, names), 0);
    },
    [validate],
  );

  const removeValidator = useCallback(
    (params: ISetValidatorParams) => {
      fields.current.delete(params);
      debouncedValidate();
    },
    [debouncedValidate],
  );

  const setValidator = useCallback(
    (params: ISetValidatorParams) => {
      fields.current.add(params);
      debouncedValidate();
    },
    [debouncedValidate],
  );

  const handleChange = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      debouncedValidate(
        mode === 'all' || mode === 'change',
        revalidateMode === 'change',
        (event.target as HTMLInputElement).name,
      );
    },
    [mode, debouncedValidate, revalidateMode],
  );

  const handleReset = useCallback(() => {
    if (ref.current) {
      getFormInputs(ref.current).forEach((input) => (input.value = ''));
    }
    setErrors(initialError);
    const validatorMap = getValidatorMap(fields.current, validators, messages);
    for (const [, set] of validatorMap.entries()) {
      for (const params of set.values()) {
        params.setErrors?.(initialError);
      }
    }
    debouncedValidate();
  }, [debouncedValidate, messages, validators]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      if (validate(true)) {
        onSubmit?.(event);
      } else {
        event.preventDefault();
      }
    },
    [onSubmit, validate],
  );

  useEffect(() => {
    validate();
  }, [validate]);

  // Manage blur event listeners
  useEffect(() => {
    if (
      ref.current &&
      (mode === 'all' || mode === 'blur' || revalidateMode === 'blur')
    ) {
      const inputs = getFormInputs(ref.current);
      const listeners = inputs.map<[HTMLInputElement, () => void]>((input) => {
        const eventHandler = (): boolean =>
          validate(
            mode === 'all' || mode === 'blur',
            revalidateMode === 'blur',
            input.getAttribute('name'),
          );
        input.addEventListener('blur', eventHandler);
        return [input, eventHandler];
      });
      return () =>
        listeners.forEach(([input, eventHandler]) =>
          input.removeEventListener('blur', eventHandler),
        );
    }
    return undefined;
  }, [mode, revalidateMode, validate]);

  const formProps = useMemo(
    () => ({
      noValidate: !useNativeValidation,
      onChange: handleChange,
      onReset: handleReset,
      onSubmit: handleSubmit,
      ref,
    }),
    [handleChange, handleReset, handleSubmit, useNativeValidation],
  );

  return useMemo(
    () => ({
      errors,
      formProps,
      messages,
      mode,
      ref,
      removeValidator,
      revalidateMode,
      setValidator,
      subscribe,
      useNativeValidation,
      validate,
    }),
    [
      errors,
      formProps,
      messages,
      mode,
      removeValidator,
      revalidateMode,
      setValidator,
      subscribe,
      useNativeValidation,
      validate,
    ],
  );
}
