import {
  FormEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getFormValidate, insertInMapSet } from '../helpers';
import {
  IError,
  IFormContext,
  IFormMode,
  IFormValidator,
  IReset,
  IValidate,
  IValidatorMultiple,
} from '../types';

export interface IField {
  reset: IReset;
  validate: IValidate;
}

export type IFields = Map<string, IField>;

export interface IUseFormProps {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  mode?: IFormMode;
  useNativeValidation?: boolean;
  validators?:
    | Record<string, IValidatorMultiple | IFormValidator>
    | IFormValidator[];
}

export interface IUseFormResult extends IFormContext {
  formProps: {
    noValidate: boolean;
    onChange: (event: FormEvent<HTMLFormElement>) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onReset: () => void;
    ref: RefObject<HTMLFormElement>;
  };
}

export function useForm(props: IUseFormProps): IUseFormResult {
  const {
    onSubmit,
    mode = 'none',
    useNativeValidation = true,
    validators,
  } = props;
  const ref = useRef<HTMLFormElement>(null);
  const fields = useRef<IFields>(new Map());
  const checkValidityPromise = useRef<Promise<null> | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<IError>({});

  const validateForm = useCallback(
    (mode: IFormMode, names?: string | string[]) => {
      if (!ref.current) {
        return false;
      }
      const formData: FormData = new FormData(ref.current);

      // field validation
      const validatorMap = new Map<string, Set<IValidate>>();
      for (const [name, { validate }] of fields.current.entries()) {
        if (
          !names ||
          (names instanceof Array ? names.includes(name) : names === name)
        ) {
          insertInMapSet(validatorMap, name, validate);
        }
      }

      // Form validation
      if (validators) {
        for (const [name, value] of Object.entries(validators)) {
          if (typeof value === 'function') {
            if (
              !names ||
              (names instanceof Array ? names.includes(name) : names === name)
            ) {
              const validate = getFormValidate(
                ref.current,
                [name],
                useNativeValidation,
                setErrors,
                value,
              );
              insertInMapSet(validatorMap, name, validate);
            }
          } else {
            const { names: validatorNames, validator } = value;
            if (!names) {
              const validate = getFormValidate(
                ref.current,
                validatorNames,
                useNativeValidation,
                setErrors,
                validator,
              );
              insertInMapSet(validatorMap, name, validate);
            } else {
              for (const name of validatorNames) {
                if (
                  names instanceof Array ? names.includes(name) : names === name
                ) {
                  const validate = getFormValidate(
                    ref.current,
                    validatorNames,
                    useNativeValidation,
                    setErrors,
                    validator,
                  );
                  insertInMapSet(validatorMap, name, validate);
                }
              }
            }
          }
        }
      }

      // Validate
      for (const [name, set] of validatorMap.entries()) {
        for (const validate of set.values()) {
          if (!names) {
            validate(mode, formData);
          } else {
            validate(mode, formData, name);
          }
        }
      }

      const isValid = Boolean(ref.current?.checkValidity());
      setIsValid(isValid);
      return isValid;
    },
    [useNativeValidation, validators],
  );

  const resetForm = useCallback(() => {
    for (const { reset } of fields.current.values()) {
      reset();
    }
    validateForm('none');
  }, [validateForm]);

  const removeValidator = useCallback((name: string) => {
    fields.current.delete(name);
  }, []);

  const setValidator = useCallback(
    (name: string, validate: IValidate, reset: IReset) => {
      fields.current.set(name, { reset, validate });
    },
    [],
  );

  const checkValidity = useCallback((mode: IFormMode) => {
    if (!checkValidityPromise.current) {
      checkValidityPromise.current = new Promise((resolve) =>
        setTimeout(resolve, 0),
      )
        .then(() => validateForm(mode))
        .then(() => (checkValidityPromise.current = null));
    }
  }, []);

  if (!ref.current) {
    checkValidity('none');
  }

  return useMemo(
    () => ({
      checkValidity,
      errors,
      formProps: {
        noValidate: useNativeValidation,
        onChange: (event: FormEvent<HTMLFormElement>) =>
          validateForm(mode, (event.target as HTMLInputElement).name),
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          if (validateForm('check')) {
            onSubmit?.(event);
          }
        },
        onReset: resetForm,
        ref,
      },
      isValid,
      mode,
      removeValidator,
      resetForm,
      setValidator,
      useNativeValidation,
      validateForm,
    }),
    [
      checkValidity,
      errors,
      isValid,
      mode,
      onSubmit,
      removeValidator,
      setValidator,
      useNativeValidation,
      validateForm,
    ],
  );
}
