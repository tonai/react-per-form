import type {
  IError,
  IFormContext,
  IFormMode,
  IFormRevalidateMode,
  IFormValues,
  IMessages,
  IOnChangeHandlerParams,
  IRegisterParams,
  IResetHandler,
  ISubmitErrorHandler,
  ISubmitHandler,
  ISubscriber,
  ITransformers,
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
  getDefaultValues,
  getFormInput,
  getFormInputs,
  getName,
  getTransformers,
  getValidatorMap,
  getValue,
  isCheckbox,
  isFormElement,
  shouldBlur,
  shouldChange,
  validateForm,
} from '../helpers';

export interface IUseFormProps {
  defaultValues?: Record<string, unknown>;
  focusOnError?: boolean;
  form?: HTMLFormElement;
  messages?: IMessages;
  mode?: IFormMode;
  onBlurOptOut?: string[] | string;
  onChangeOptOut?: string[] | string;
  onReset?: IResetHandler;
  onSubmit?: ISubmitHandler;
  onSubmitError?: ISubmitErrorHandler;
  revalidateMode?: IFormRevalidateMode;
  transformers?: ITransformers;
  useNativeValidation?: boolean;
  validators?: Record<string, IValidator | IValidatorObject>;
}

export interface INativeFormProps {
  noValidate: boolean;
  onChange: (event: FormEvent<HTMLFormElement>) => void;
  onReset: (event: FormEvent<HTMLFormElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  ref: RefObject<HTMLFormElement>;
}

export interface IUseFormResult extends IFormContext {
  formProps: INativeFormProps;
}

export function useForm(props: IUseFormProps = {}): IUseFormResult {
  const {
    defaultValues,
    focusOnError = true,
    form = null,
    messages,
    mode = 'submit',
    onBlurOptOut,
    onChangeOptOut,
    onReset,
    onSubmit,
    onSubmitError,
    revalidateMode = 'submit',
    transformers,
    useNativeValidation = true,
    validators,
  } = props;
  const ref = useRef<HTMLFormElement>(form);
  const fields = useRef<Set<IRegisterParams>>(new Set());
  const defaultVals = useRef<IFormValues>(defaultValues ?? {});
  const prevVals = useRef<IFormValues>({});
  const vals = useRef<IFormValues>({});
  const resetVals = useRef<IFormValues | null | undefined>(null);
  const manualErrors = useRef<Record<string, string | null>>({});
  const changeNames = useRef<Record<string, boolean>>({});
  const changeHandlerInitializers = useRef<Record<string, () => void>>({});
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
      const newValues = getData({
        form: ref.current,
        transformers: getTransformers(fields.current, transformers),
        values: vals.current,
      });
      for (const [subscriber, names] of subscribers.current.entries()) {
        const newFilteredValues = filterObject(
          newValues,
          ([name]) => !names || names.includes(name),
        );
        const prevFilteredValues = filterObject(
          prevVals.current,
          ([name]) => !names || names.includes(name),
        );
        subscriber({
          form: ref.current,
          names,
          prevValues: prevFilteredValues,
          values: newFilteredValues,
        });
      }
      prevVals.current = { ...newValues };
    }
  }, [transformers]);

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
      const errors = validateForm({
        display,
        errors: manualErrors.current,
        focusOnError,
        form: ref.current,
        messages,
        names: names instanceof Array ? names : names ? [names] : undefined,
        revalidate,
        setErrors,
        transformers: getTransformers(fields.current, transformers),
        useNativeValidation,
        validatorMap,
        values: vals.current,
      });

      notify();
      return [Boolean(ref.current.checkValidity()), errors];
    },
    [messages, notify, useNativeValidation, transformers, validators],
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

  const setValues = useCallback((values: IFormValues) => {
    if (ref.current) {
      for (const input of getFormInputs(ref.current)) {
        const formField = getFormInput(input);
        const { name } = formField;
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

  const register = useCallback(
    (params: IRegisterParams) => {
      fields.current.add(params);
      if (params.defaultValues) {
        defaultVals.current = {
          ...defaultVals.current,
          ...params.defaultValues,
        };
        setValues(params.defaultValues);
      }
      debouncedValidate();
    },
    [debouncedValidate, setValues],
  );

  const unregister = useCallback(
    (params: IRegisterParams) => {
      fields.current.delete(params);
      debouncedValidate();
    },
    [debouncedValidate],
  );

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
      vals.current = {};
      defaultVals.current = getDefaultValues(
        fields.current,
        defaultValues,
        paramValues,
        resetVals.current,
      );
      resetVals.current = null;
      for (const init of Object.values(changeHandlerInitializers.current)) {
        init();
      }
      setTimeout(() => {
        setValues(defaultVals.current);
        debouncedValidate();
      });
    },
    [debouncedValidate, defaultValues, messages, setValues, validators],
  );

  const reset = useCallback((values?: IFormValues | null) => {
    resetVals.current = values;
    ref.current?.reset();
  }, []);

  const change = useCallback(
    <V>(value: unknown, name?: string): [string, V] => {
      const fieldName = getName(value) ?? name;
      if (!fieldName) {
        throw new Error(
          'react-swift-form was unable to retrieve the field name',
        );
      }
      const allTransformers = getTransformers(fields.current, transformers);
      const val = getValue<V>(value, allTransformers?.[fieldName]);
      vals.current[fieldName] = val;
      debouncedValidate(
        mode === 'all' || mode === 'change',
        revalidateMode === 'change',
        false,
        fieldName,
      );
      return [fieldName, val];
    },
    [debouncedValidate, mode, revalidateMode, transformers],
  );

  const handleChange = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const name = getName(event);
      if (name && changeNames.current[name]) {
        // Prevent double call to the change function when we use the onChange handler
        // The handler is called first and then the event propagates
        // But we can't always prevent it because sometimes we don't have access to the event object
        // Like with the MUI Datepicker
        changeNames.current[name] = false;
      } else if (shouldChange(fields.current, name, onChangeOptOut)) {
        change(event);
      }
    },
    [change, onChangeOptOut],
  );

  const handleReset = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const resetValues = onReset?.(event, vals.current);
      resetForm(resetValues);
    },
    [onReset, resetForm],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const [isValid, errors] = validate(true, false, focusOnError);
      if (isValid && ref.current) {
        onSubmit?.(
          event,
          getData({
            form: ref.current,
            transformers: getTransformers(fields.current, transformers),
            values: vals.current,
          }),
          reset,
        );
      } else {
        event.preventDefault();
        onSubmitError?.(event, errors, reset);
      }
    },
    [focusOnError, onSubmit, onSubmitError, reset, transformers, validate],
  );

  useEffect(() => {
    defaultVals.current = { ...defaultVals.current, ...defaultValues };
    for (const init of Object.values(changeHandlerInitializers.current)) {
      init();
    }
    setValues(defaultVals.current);
    debouncedValidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, setValues]);

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
        if (
          event.target &&
          isFormElement(event.target) &&
          shouldBlur(fields.current, event.target.name, onBlurOptOut)
        ) {
          validate(
            mode === 'all' || mode === 'blur',
            revalidateMode === 'blur',
            false,
            event.target.name,
          );
        }
      };
      form.addEventListener('focusout', handleFocusOut);
      return () => form.removeEventListener('focusout', handleFocusOut);
    }
    return undefined;
  }, [mode, onBlurOptOut, revalidateMode, validate]);

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
      callback: (value: V, ...args: T) => void,
      params: IOnChangeHandlerParams<V, T> = {},
    ) => {
      const { getError, name } = params;
      if (name) {
        // Value initializer
        const init = (): void => {
          if (
            vals.current[name] === undefined &&
            defaultVals.current[name] !== undefined
          ) {
            vals.current[name] = defaultVals.current[name];
          }
        };
        changeHandlerInitializers.current[name] = init;
        init();
      }
      return (value: unknown, ...args: T): void => {
        const [fieldName, val] = change<V>(value, name);
        changeNames.current[fieldName] = true;
        if (getError) {
          onErrorHandler(fieldName)(getError(val, ...args));
        }
        callback(val, ...args);
      };
    },
    [change, onErrorHandler],
  );

  const onResetHandler = useCallback(
    (callback?: IResetHandler) => {
      return (event: FormEvent<HTMLFormElement>) => {
        const resetValues = callback?.(event, vals.current);
        resetForm(resetValues);
      };
    },
    [resetForm],
  );

  const onSubmitHandler = useCallback(
    (validCallback?: ISubmitHandler, invalidCallback?: ISubmitErrorHandler) => {
      return (event: FormEvent<HTMLFormElement>) => {
        const [isValid, errors] = validate(true, false, focusOnError);
        if (isValid && ref.current) {
          validCallback?.(
            event,
            getData({
              form: ref.current,
              transformers: getTransformers(fields.current, transformers),
              values: vals.current,
            }),
            reset,
          );
        } else {
          event.preventDefault();
          invalidCallback?.(event, errors, reset);
        }
      };
    },
    [focusOnError, reset, transformers, validate],
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
      register,
      reset,
      revalidateMode,
      subscribe,
      unregister,
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
      register,
      reset,
      revalidateMode,
      subscribe,
      unregister,
      useNativeValidation,
      validate,
      watch,
    ],
  );
}
