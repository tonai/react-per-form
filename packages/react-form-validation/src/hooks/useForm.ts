import type {
  IError,
  IFormContext,
  IFormMode,
  IFormValidator,
  ISetValidatorParams,
  ISubscriber,
  IValidatorMultiple,
  IValidityMessages,
} from '../types';
import type { FormEvent, RefObject } from 'react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getFormInputs, insertInMapSet, validateForm } from '../helpers';

export interface IUseFormProps {
  messages?: IValidityMessages;
  mode?: IFormMode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
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

export function useForm(props: IUseFormProps): IUseFormResult {
  const {
    onSubmit,
    messages,
    mode = 'none',
    useNativeValidation = true,
    validators,
  } = props;
  const ref = useRef<HTMLFormElement>(null);
  const fields = useRef<Set<ISetValidatorParams>>(new Set());
  const [errors, setErrors] = useState<IError>({
    all: {},
    native: {},
    validator: {},
  });

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
    (mode: IFormMode, names?: string[] | string | null) => {
      if (!ref.current) {
        return false;
      }

      // field validation
      const validatorMap = new Map<string, Set<ISetValidatorParams>>();
      for (const params of fields.current.values()) {
        for (const name of params.names) {
          insertInMapSet(validatorMap, name, params);
        }
      }

      // Form validation
      if (validators) {
        for (const [id, value] of Object.entries(validators)) {
          if (typeof value === 'function') {
            // Array.from(fields.current).find(params => params.names.includes(name));
            insertInMapSet(validatorMap, id, {
              id,
              messages,
              names: [id],
              validator: value,
            });
          } else {
            const { names: validatorNames, validator } = value;
            for (const name of validatorNames) {
              insertInMapSet(validatorMap, name, {
                id,
                messages,
                names: validatorNames,
                validator,
              });
            }
          }
        }
      }

      // Validate
      validateForm(
        ref.current,
        validatorMap,
        setErrors,
        mode,
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
    (mode: IFormMode, names?: string[] | string | null) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => validate(mode, names), 0);
    },
    [validate],
  );

  const removeValidator = useCallback(
    (params: ISetValidatorParams) => {
      fields.current.delete(params);
      debouncedValidate('none');
    },
    [debouncedValidate],
  );

  const setValidator = useCallback(
    (params: ISetValidatorParams) => {
      fields.current.add(params);
      debouncedValidate('none');
    },
    [debouncedValidate],
  );

  const handleChange = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      debouncedValidate(mode, (event.target as HTMLInputElement).name);
    },
    [mode, debouncedValidate],
  );

  const handleReset = useCallback(() => {
    if (ref.current) {
      getFormInputs(ref.current).forEach((input) => (input.value = ''));
    }
    debouncedValidate('none');
  }, [debouncedValidate]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (validate('check')) {
        onSubmit?.(event);
      }
    },
    [onSubmit, validate],
  );

  useEffect(() => {
    debouncedValidate('none');
  }, [debouncedValidate]);

  // Manage blur event listeners
  useEffect(() => {
    if (ref.current && (mode === 'check' || mode === 'blur')) {
      const inputs = getFormInputs(ref.current);
      const listeners = inputs.map<[HTMLInputElement, () => void]>((input) => {
        const eventHandler = (): boolean =>
          validate('check', input.getAttribute('name'));
        input.addEventListener('blur', eventHandler);
        return [input, eventHandler];
      });
      return () =>
        listeners.forEach(([input, eventHandler]) =>
          input.removeEventListener('blur', eventHandler),
        );
    }
    return undefined;
  }, [mode, validate]);

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
      setValidator,
      subscribe,
      useNativeValidation,
      validate,
    ],
  );
}
