import type { Dispatch, RefObject, SetStateAction } from 'react';

export type IFormMode = 'all' | 'blur' | 'change' | 'submit';

export type IFormRevalidateMode = 'blur' | 'change' | 'submit';

export type IValidate = (
  mode: IFormMode,
  formData: FormData,
  name?: string,
) => IError;

export type IFormValidate = (
  display?: boolean,
  revalidate?: boolean,
  focusOnError?: boolean,
  name?: string[] | string,
) => boolean;

export type IFormValues = Record<string, FormDataEntryValue | null>;

export type IValidator = (values: IFormValues, names: string[]) => string;

export interface IFormValidator {
  names: string[];
  validator: IValidator;
}

export interface ISetValidatorParams {
  id: string;
  messages?: IValidityMessages;
  names: string[];
  setErrors?: Dispatch<SetStateAction<IError>>;
  validator?: IValidator;
}

export type ISetValidator = (params: ISetValidatorParams) => void;

export type IRemoveValidator = (params: ISetValidatorParams) => void;

export interface IMainError {
  error: string;
  global: boolean;
  id: string;
  names: string[];
}

export interface IValidatorError {
  error: string;
  global: boolean;
  names: string[];
}

export interface IError {
  all: Record<string, string>;
  global: Record<string, IValidatorError>;
  main?: IMainError;
  native: Record<string, string>;
  validator: Record<string, IValidatorError>;
}

export type ISubscriber = (form: HTMLFormElement | null) => void;

export type IUnSubscribe = () => void;

export interface IFormContext {
  errors: IError;
  messages?: IValidityMessages;
  mode: IFormMode;
  ref: RefObject<HTMLFormElement>;
  removeValidator: IRemoveValidator;
  revalidateMode: IFormRevalidateMode;
  setValidator: ISetValidator;
  subscribe: (subscriber: ISubscriber) => IUnSubscribe;
  useNativeValidation: boolean;
  validate: IFormValidate;
}

export type IValidityMessages = Partial<Record<keyof ValidityState, string>>;
