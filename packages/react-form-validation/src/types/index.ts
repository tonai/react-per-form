import type { Dispatch, RefObject, SetStateAction } from 'react';

export type IFormElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | RadioNodeList;

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

export interface IValidatorObject {
  names: string[];
  validator: IValidator;
}

export interface ISetValidatorsParams {
  id: string;
  messages?: IValidityMessages;
  names: string[];
  setErrors?: Dispatch<SetStateAction<IError>>;
  validators?:
    | IValidator
    | IValidatorObject
    | Record<string, IValidator | IValidatorObject>;
}

export interface IFormValidator {
  id: string;
  messages?: IValidityMessages;
  names: string[];
  setErrors?: Dispatch<SetStateAction<IError>>;
  validator?: IValidator;
}

export type ISetValidators = (params: ISetValidatorsParams) => void;

export type IRemoveValidators = (params: ISetValidatorsParams) => void;

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
  removeValidators: IRemoveValidators;
  revalidateMode: IFormRevalidateMode;
  setValidators: ISetValidators;
  subscribe: (subscriber: ISubscriber) => IUnSubscribe;
  useNativeValidation: boolean;
  validate: IFormValidate;
}

export type IValidityMessages = Partial<Record<keyof ValidityState, string>>;
