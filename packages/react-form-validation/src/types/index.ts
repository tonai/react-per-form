import type { Dispatch, RefObject, SetStateAction } from 'react';

export type IFormMode = 'blur' | 'change' | 'check' | 'fix' | 'none';

export type IValidate = (
  mode: IFormMode,
  formData: FormData,
  name?: string,
) => IError;

export type IFormValidate = (
  mode: IFormMode,
  name?: string[] | string,
) => boolean;

export type IFormValues = Record<string, FormDataEntryValue | null>;

export type IValidator = (
  value: FormDataEntryValue | null,
  name: string,
) => string;

export type IValidatorMultiple = (
  values: IFormValues,
  names: string[],
) => string;

export interface IFormValidator {
  names: string[];
  validator: IValidatorMultiple;
}

export interface ISetValidatorParams {
  id: string;
  messages?: IValidityMessages;
  names: string[];
  setErrors?: Dispatch<SetStateAction<IError>>;
  validator: IValidatorMultiple;
}

export type ISetValidator = (params: ISetValidatorParams) => void;

export type IRemoveValidator = (params: ISetValidatorParams) => void;

export interface IMainError {
  error: string;
  id: string;
  names: string[];
}

export interface IValidatorError {
  error: string;
  names: string[];
}

export interface IError {
  all: Record<string, string>;
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
  setValidator: ISetValidator;
  subscribe: (subscriber: ISubscriber) => IUnSubscribe;
  useNativeValidation: boolean;
  validate: IFormValidate;
}

export type IValidityMessages = Partial<Record<keyof ValidityState, string>>;
