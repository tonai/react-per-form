import type {
  IError,
  IFormContext,
  IFormElement,
  IFormMode,
  IFormRevalidateMode,
  IFormValues,
  IMessages,
  IOnChangeHandlerParams,
  IResetHandler,
  ISetValidatorsParams,
  ISubmitErrorHandler,
  ISubmitHandler,
  ISubscriber,
  IValidator,
  IValidatorObject,
} from '../types';
import type { FormEvent, RefObject } from 'react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { initialError } from '../constants';
import {
  areObjectEquals,
  filterObject,
  getData,
  getFormInput,
  getFormInputs,
  getName,
  getValidatorMap,
  getValue,
  isCheckbox,
  isFormElement,
  validateForm,
} from '../helpers';

export interface IUseFormProps {
  defaultValues?: Record<string, unknown>;
  focusOnError?: boolean;
  form?: HTMLFormElement;
  messages?: IMessages;
  mode?: IFormMode;
  onReset?: IResetHandler;
  onSubmit?: ISubmitHandler;
  onSubmitError?: ISubmitErrorHandler;
  revalidateMode?: IFormRevalidateMode;
  useNativeValidation?: boolean;
  validators?: Record<string, IValidator | IValidatorObject>;
}

export interface IUseFormResult extends IFormContext {
  formProps: {
    noValidate: boolean;
    onChange: (event: FormEvent<HTMLFormElement>) => void;
    onReset: (event: FormEvent<HTMLFormElement>) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    ref: RefObject<HTMLFormElement>;
  };
}

export function useForm(props: IUseFormProps = {}): IUseFormResult {
  const {
    defaultValues,
    focusOnError = true,
    form = null,
    onReset,
    onSubmit,
    onSubmitError,
    messages,
    mode = 'submit',
    revalidateMode = 'submit',
    useNativeValidation = true,
    validators,
  } = props;
  const ref = useRef<HTMLFormElement>(form);
  const fields = useRef<Set<ISetValidatorsParams>>(new Set());
  const prevValues = useRef<Record<string, unknown>>(
    defaultValues ? { ...defaultValues } : {},
  );
  const values = useRef<Record<string, unknown>>(
    defaultValues ? { ...defaultValues } : {},
  );
  const resetValues = useRef<IFormValues | null | undefined>(null);
  const manualErrors = useRef<Record<string, string | null>>({});
  const [errors, setErrors] = useState<IError>(initialError);

  // Observer
  const subscribers = useRef<Map<ISubscriber, string[] | undefined>>(new Map());
  const subscribe = useCallback(
    (subscriber: ISubscriber, names?: string[] | string) => {
      const nameArray =
        names === undefined ? names : names instanceof Array ? names : [names];
      if (!subscribers.current.has(subscriber)) {
        subscribers.current.set(subscriber, nameArray);
      }
      return () => subscribers.current.delete(subscriber);
    },
    [],
  );
  const notify = useCallback(() => {
    if (ref.current) {
      const newValues = getData(ref.current, values.current);
      for (const [subscriber, names] of subscribers.current.entries()) {
        const newFilteredValues = filterObject(
          newValues,
          ([name]) => !names || names.includes(name),
        );
        const prevFilteredValues = filterObject(
          prevValues.current,
          ([name]) => !names || names.includes(name),
        );
        subscriber({
          form: ref.current,
          names,
          prevValues: prevFilteredValues,
          values: newFilteredValues,
        });
      }
      prevValues.current = { ...newValues };
    }
  }, []);

  const validate = useCallback(
    (
      display = false,
      revalidate = false,
      focusOnError = false,
      names?: string[] | string | null,
    ): [boolean, IError] => {
      if (!ref.current) {
        return [false, initialError];
      }

      const validatorMap = getValidatorMap(
        fields.current,
        validators,
        messages,
      );

      // Validate
      const errors = validateForm(
        ref.current,
        validatorMap,
        setErrors,
        display,
        revalidate,
        useNativeValidation,
        values.current,
        manualErrors.current,
        messages,
        focusOnError,
        names instanceof Array ? names : names ? [names] : undefined,
      );

      notify();
      return [Boolean(ref.current.checkValidity()), errors];
    },
    [messages, notify, useNativeValidation, validators],
  );

  const timer = useRef<NodeJS.Timeout>();
  const debouncedValidate = useCallback(
    (
      display?: boolean,
      revalidate?: boolean,
      focusOnError?: boolean,
      names?: string[] | string | null,
    ) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(
        () => validate(display, revalidate, focusOnError, names),
        0,
      );
    },
    [validate],
  );

  const removeValidators = useCallback(
    (params: ISetValidatorsParams) => {
      fields.current.delete(params);
      debouncedValidate();
    },
    [debouncedValidate],
  );

  const setValidators = useCallback(
    (params: ISetValidatorsParams) => {
      fields.current.add(params);
      debouncedValidate();
    },
    [debouncedValidate],
  );

  const setValues = useCallback((values?: IFormValues) => {
    if (ref.current && values) {
      for (const input of getFormInputs(ref.current)) {
        const formField = getFormInput(input);
        const name = formField.getAttribute('name');
        if (name && values[name] !== undefined && values[name] !== null) {
          if (isCheckbox(formField)) {
            formField.checked = Boolean(values[name]);
          } else {
            formField.value = String(values[name]);
          }
        }
      }
    }
  }, []);

  const resetForm = useCallback(
    (paramValues?: IFormValues | null | void) => {
      setErrors(initialError);
      const validatorMap = getValidatorMap(
        fields.current,
        validators,
        messages,
      );
      for (const [, set] of validatorMap.entries()) {
        for (const params of set.values()) {
          params.setErrors?.(initialError);
        }
      }
      values.current = defaultValues ? { ...defaultValues } : {};
      if (paramValues) {
        values.current = { ...values.current, ...paramValues };
      }
      if (resetValues.current) {
        values.current = { ...values.current, ...resetValues.current };
        resetValues.current = null;
      }
      setTimeout(() => setValues(values.current));
    },
    [defaultValues, messages, setValues, validators],
  );

  const reset = useCallback((values?: IFormValues | null) => {
    resetValues.current = values;
    ref.current?.reset();
  }, []);

  const handleChange = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      debouncedValidate(
        mode === 'all' || mode === 'change',
        revalidateMode === 'change',
        false,
        getFormInput(event.target as IFormElement).name,
      );
    },
    [mode, debouncedValidate, revalidateMode],
  );

  const handleReset = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const resetValues = onReset?.(event, values.current);
      resetForm(resetValues);
      debouncedValidate();
    },
    [debouncedValidate, onReset, resetForm],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const [isValid, errors] = validate(true, false, focusOnError);
      if (isValid && ref.current) {
        onSubmit?.(event, getData(ref.current, values.current), reset);
      } else {
        event.preventDefault();
        onSubmitError?.(event, errors, reset);
      }
    },
    [focusOnError, onSubmit, onSubmitError, reset, validate],
  );

  useEffect(() => {
    setValues(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValues]);

  useEffect(() => {
    debouncedValidate();
  }, [debouncedValidate]);

  // Manage blur event listeners
  useEffect(() => {
    if (
      ref.current &&
      (mode === 'all' || mode === 'blur' || revalidateMode === 'blur')
    ) {
      const form = ref.current;
      const handleFocusOut = (event: FocusEvent): void => {
        if (event.target && isFormElement(event.target)) {
          validate(
            mode === 'all' || mode === 'blur',
            revalidateMode === 'blur',
            false,
            event.target.getAttribute('name'),
          );
        }
      };
      form.addEventListener('focusout', handleFocusOut);
      return () => form.removeEventListener('focusout', handleFocusOut);
    }
    return undefined;
  }, [mode, revalidateMode, validate]);

  const onErrorHandler = useCallback(
    (name: string) => {
      return (manualError: string | null) => {
        manualErrors.current[name] = manualError;
        debouncedValidate(
          mode === 'all' || mode === 'change',
          revalidateMode === 'change',
          false,
          name,
        );
      };
    },
    [debouncedValidate, mode, revalidateMode],
  );

  const onChangeHandler = useCallback(
    <V, T extends unknown[] = unknown[]>(
      params: IOnChangeHandlerParams<V, T> = {},
    ) => {
      const { callback, getError, name, transformer } = params;
      return (value: unknown, ...args: T) => {
        const fieldName = getName(value) ?? name;
        if (!fieldName) {
          throw new Error(
            'react-swift-form was unable to retrieve the field name',
          );
        }
        let val = getValue(value) as V;
        if (transformer) {
          val = transformer(val);
        }
        values.current[fieldName] = val;
        if (getError) {
          onErrorHandler(fieldName)(getError(val, ...args));
        }
        debouncedValidate(
          mode === 'all' || mode === 'change',
          revalidateMode === 'change',
          false,
          name,
        );
        callback?.(val, ...args);
      };
    },
    [debouncedValidate, mode, onErrorHandler, revalidateMode],
  );

  const onResetHandler = useCallback(
    (callback?: IResetHandler) => {
      return (event: FormEvent<HTMLFormElement>) => {
        const resetValues = callback?.(event, values.current);
        resetForm(resetValues);
        debouncedValidate();
      };
    },
    [debouncedValidate, resetForm],
  );

  const onSubmitHandler = useCallback(
    (validCallback?: ISubmitHandler, invalidCallback?: ISubmitErrorHandler) => {
      return (event: FormEvent<HTMLFormElement>) => {
        const [isValid, errors] = validate(true, false, focusOnError);
        if (isValid && ref.current) {
          validCallback?.(event, getData(ref.current, values.current), reset);
        } else {
          event.preventDefault();
          invalidCallback?.(event, errors, reset);
        }
      };
    },
    [focusOnError, reset, validate],
  );

  const watch = useCallback(
    <V extends IFormValues>(
      callback: (values: V) => void,
      names?: string[] | string,
    ) => {
      return subscribe(({ prevValues, values }) => {
        if (!areObjectEquals(values, prevValues)) {
          callback(values as V);
        }
      }, names);
    },
    [subscribe],
  );

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
      form: ref,
      formProps,
      messages,
      mode,
      onChange: onChangeHandler,
      onError: onErrorHandler,
      onReset: onResetHandler,
      onSubmit: onSubmitHandler,
      removeValidators,
      reset,
      revalidateMode,
      setValidators,
      subscribe,
      useNativeValidation,
      validate,
      watch,
    }),
    [
      errors,
      formProps,
      messages,
      mode,
      onChangeHandler,
      onErrorHandler,
      onResetHandler,
      onSubmitHandler,
      removeValidators,
      reset,
      revalidateMode,
      setValidators,
      subscribe,
      useNativeValidation,
      validate,
      watch,
    ],
  );
}
