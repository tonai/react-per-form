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
  IStateSubscriber,
  IStates,
  ISubmitErrorHandler,
  ISubmitHandler,
  ITransformers,
  IValidator,
  IValidatorObject,
  IWatchSubscriber,
} from '../types';
import type { FormEvent, RefObject } from 'react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { initialError, initialStates } from '../constants';
import {
  areObjectEquals,
  filterObject,
  getData,
  getDefaultValues,
  getFormInput,
  getFormInputs,
  getFormState,
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
  const states = useRef<IStates>({
    ...initialStates,
    changedFields: new Set<string>(),
    isReady: false,
    touchedFields: new Set<string>(),
  });
  const prevErrors = useRef<IError>(initialError);
  const [errors, setErrors] = useState<IError>(initialError);

  // State observer
  const stateSubscribers = useRef<Set<IStateSubscriber>>(new Set());
  const stateSubscribe = useCallback((subscriber: IStateSubscriber) => {
    if (!stateSubscribers.current.has(subscriber)) {
      stateSubscribers.current.add(subscriber);
    }
    return () => stateSubscribers.current.delete(subscriber);
  }, []);
  const stateNotify = useCallback(() => {
    for (const subscriber of stateSubscribers.current.values()) {
      subscriber(
        getFormState(
          states.current,
          vals.current,
          defaultVals.current,
          ref.current,
        ),
      );
    }
  }, []);

  // Value observer (watch)
  const watchSubscriber = useRef<Map<IWatchSubscriber, string[] | undefined>>(
    new Map(),
  );
  const watchSubscribe = useCallback(
    (subscriber: IWatchSubscriber, names?: string[] | string) => {
      const nameArray =
        names === undefined ? names : names instanceof Array ? names : [names];
      if (!watchSubscriber.current.has(subscriber)) {
        watchSubscriber.current.set(subscriber, nameArray);
      }
      return () => watchSubscriber.current.delete(subscriber);
    },
    [],
  );
  const watchNotify = useCallback(() => {
    if (ref.current) {
      const newValues = getData({
        form: ref.current,
        transformers: getTransformers(fields.current, transformers),
        values: vals.current,
      });
      for (const [subscriber, names] of watchSubscriber.current.entries()) {
        const newFilteredValues = filterObject(
          newValues,
          ([name]) => !names || names.includes(name),
        );
        const prevFilteredValues = filterObject(
          prevVals.current,
          ([name]) => !names || names.includes(name),
        );
        subscriber({
          names,
          prevValues: prevFilteredValues,
          values: newFilteredValues,
        });
      }
      prevVals.current = { ...newValues };
    }
  }, [transformers]);

  const validate = useCallback(
    async (
      display = false,
      revalidate = false,
      focusOnError = false,
      names?: string[] | string | null,
    ): Promise<[boolean, IError]> => {
      if (!ref.current) {
        return [false, initialError];
      }
      states.current.isValidating = true;
      stateNotify();

      let errors;
      try {
        const validatorMap = getValidatorMap(
          fields.current,
          validators,
          messages,
        );

        // Validate
        errors = await validateForm({
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
      } finally {
        states.current.isValidating = false;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        states.current.isValid = Boolean(ref.current?.checkValidity());
        stateNotify();
      }

      return [states.current.isValid, errors];
    },
    [messages, stateNotify, useNativeValidation, transformers, validators],
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
        () => void validate(display, revalidate, focusOnError, names),
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
      // Reset errors.
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
      // Reset states
      states.current = {
        ...initialStates,
        changedFields: new Set<string>(),
        isReady: states.current.isReady,
        touchedFields: new Set<string>(),
      };
      // Reset values
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
      states.current.changedFields.add(fieldName);
      const allTransformers = getTransformers(fields.current, transformers);
      const val = getValue<V>(value, allTransformers?.[fieldName]);
      vals.current[fieldName] = val;
      watchNotify();
      debouncedValidate(
        mode === 'all' || mode === 'change',
        revalidateMode === 'change',
        false,
        fieldName,
      );
      return [fieldName, val];
    },
    [debouncedValidate, mode, revalidateMode, transformers, watchNotify],
  );

  let submitted = false;
  const submit = useCallback(
    async (
      event: FormEvent<HTMLFormElement>,
      validCallback?: ISubmitHandler,
      invalidCallback?: ISubmitErrorHandler,
    ) => {
      // Flag top prevent submit infinite loop
      if (submitted) {
        return;
      }
      // We have to prevent the event (even for server actions) because we need to await the validation
      event.preventDefault();
      try {
        states.current.isSubmitting = true;
        const [isValid, errors] = await validate(true, false, focusOnError);
        if (isValid && ref.current) {
          // If the form action is not null then it should be a server action
          // In that case re-submit the form (set flag to true before to avoid infinite loop)
          if (ref.current.getAttribute('action') !== null) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            submitted = true;
            setTimeout(() => {
              // We need to call requestSubmit in setTimeout for it to work as expected
              ref.current?.requestSubmit();
              submitted = false;
            });
          }
          if (validCallback) {
            await validCallback(
              event,
              getData({
                form: ref.current,
                transformers: getTransformers(fields.current, transformers),
                values: vals.current,
              }),
              reset,
            );
          }
        } else if (invalidCallback) {
          await invalidCallback(event, errors, reset);
        }
      } catch (error) {
        console.error(error);
      } finally {
        states.current.isSubmitting = false;
        states.current.submitCount++;
        stateNotify();
      }
    },
    [focusOnError, reset, transformers, validate],
  );

  const handleChange = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const name = getName(event);
      if (name && changeNames.current[name]) {
        // Prevent double call to the change function when the onChange handler is used
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
      return submit(event, onSubmit, onSubmitError);
    },
    [onSubmit, onSubmitError, submit],
  );

  useEffect(() => {
    defaultVals.current = { ...defaultVals.current, ...defaultValues };
    for (const init of Object.values(changeHandlerInitializers.current)) {
      init();
    }
    setValues(defaultVals.current);
  }, [defaultValues, setValues]);

  useEffect(() => {
    // Prevent re-validating when we just update the errors state
    if (prevErrors.current !== errors) {
      prevErrors.current = errors;
      return;
    }
    // Do not call debounceValidate because when don't want this call to cancel a previous debounceValidate call
    // For example when we change a value and mode=change (in that case render=true but in the useEffect render=false)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    validate().then(() => {
      if (ref.current) {
        states.current.isReady = true;
        ref.current.dataset.rsf = 'init';
      }
    });
  });

  // Manage blur event listeners
  useEffect(() => {
    if (ref.current) {
      const form = ref.current;
      const handleFocusOut = (event: FocusEvent): void => {
        if (event.target && isFormElement(event.target)) {
          states.current.touchedFields.add(event.target.name);
          if (
            (mode === 'all' || mode === 'blur' || revalidateMode === 'blur') &&
            shouldBlur(fields.current, event.target.name, onBlurOptOut)
          ) {
            void validate(
              mode === 'all' || mode === 'blur',
              revalidateMode === 'blur',
              false,
              event.target.name,
            );
          } else {
            stateNotify();
          }
        }
      };
      form.addEventListener('focusout', handleFocusOut);
      return () => form.removeEventListener('focusout', handleFocusOut);
    }
    return undefined;
  }, [mode, onBlurOptOut, revalidateMode, stateNotify, validate]);

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
      return async (event: FormEvent<HTMLFormElement>) => {
        return submit(event, validCallback, invalidCallback);
      };
    },
    [submit],
  );

  const watch = useCallback(
    <V extends IFormValues>(
      callback: (values: V) => void,
      names?: string[] | string,
    ) => {
      return watchSubscribe(({ prevValues, values }) => {
        if (!areObjectEquals(values, prevValues)) {
          callback(values as V);
        }
      }, names);
    },
    [watchSubscribe],
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
      states: getFormState(
        states.current,
        vals.current,
        defaultVals.current,
        ref.current,
      ),
      subscribe: stateSubscribe,
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
      stateSubscribe,
      unregister,
      useNativeValidation,
      validate,
      watch,
    ],
  );
}
