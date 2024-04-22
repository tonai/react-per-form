import type { Dispatch, FormEvent, RefObject, SetStateAction } from 'react';

export type IFormElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | RadioNodeList;

export type IFormMode = 'all' | 'blur' | 'change' | 'submit';

export type IFormRevalidateMode = 'blur' | 'change' | 'submit';

export type IValidityMessages = Partial<Record<keyof ValidityState, string>>;

export type IMessages = Record<string, string>;

export type IFieldMessages = Record<string | symbol, IMessages>;

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
) => Promise<[boolean, IError]>;

export type IFormValues = Record<string, unknown>;

export type IValidator = (
  values: IFormValues,
  names: string[],
) => Promise<string> | string;

export interface IValidatorObject {
  names: string[];
  validator: IValidator;
}

export type ITransformers = Record<string, (value: unknown) => unknown>;

export interface IRegisterParams {
  defaultValues?: Record<string, unknown>;
  id: string;
  messages?: IMessages;
  names: string[];
  onBlurOptOut?: string[] | string;
  onChangeOptOut?: string[] | string;
  setErrors: Dispatch<SetStateAction<IError>>;
  transformers?: ITransformers;
  validators?:
    | IValidator
    | IValidatorObject
    | Record<string, IValidator | IValidatorObject>;
}

export type ILocalFields = Record<string, Dispatch<SetStateAction<IError>>>;

export interface ILocalFormValidator {
  id: string;
  messages?: IMessages;
  names: string[];
  setErrors: Dispatch<SetStateAction<IError>>;
  validator?: IValidator;
}

export interface IGlobalFormValidator {
  id: string;
  messages?: IMessages;
  names: string[];
  validator: IValidator;
}

export type IFormValidator = IGlobalFormValidator | ILocalFormValidator;

export type IRegister = (params: IRegisterParams) => void;

export type IUnregister = (params: IRegisterParams) => void;

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

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type IError = {
  all: Record<string, string>;
  global: Record<string, IValidatorError>;
  main?: IMainError;
  manual: Record<string, string | null>;
  native: Record<string, string>;
  validator: Record<string, IValidatorError>;
};

export interface IStates {
  changedFields: Set<string>;
  isReady: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  isValidating: boolean;
  submitCount: number;
  touchedFields: Set<string>;
}

export interface IFormStates
  extends Omit<IStates, 'changedFields' | 'touchedFields'> {
  changedFields: string[];
  dirtyFields: string[];
  isChanged: boolean;
  isDirty: boolean;
  isPristine: boolean;
  isSubmitted: boolean;
  isTouched: boolean;
  touchedFields: string[];
}

export type IStateSubscriber = (states: IFormStates) => void;

export interface IWatchSubscriberParams {
  names?: string[];
  prevValues: IFormValues;
  values: IFormValues;
}

export type IWatchSubscriber = (params: IWatchSubscriberParams) => void;

export type IUnSubscribe = () => void;

export type IErrorHandler = (error: string | null) => void;

export type IOnErrorHandler = (name: string) => IErrorHandler;

export interface IOnChangeHandlerParams<V, T extends unknown[] = unknown[]> {
  getError?: ((value: V, ...args: T) => string | null) | null;
  name?: string;
}

export type IOnChangeHandler = <V, T extends unknown[] = unknown[]>(
  callback: (value: V, ...args: T) => void,
  params?: IOnChangeHandlerParams<V, T>,
) => (value: unknown, ...args: T) => void;

export type IFormReset = (resetValues?: IFormValues | null) => void;

export type IResetHandler = (
  event: FormEvent<HTMLFormElement>,
  values: IFormValues,
) => IFormValues | null | void;

export type IOnResetHandler = (
  callback?: IResetHandler,
) => (event: FormEvent<HTMLFormElement>) => void;

export type ISubmitHandler<T = unknown> = (
  event: FormEvent<HTMLFormElement>,
  values: IFormValues,
  reset: IFormReset,
) => Promise<T> | T;

export type ISubmitErrorHandler<T = unknown> = (
  event: FormEvent<HTMLFormElement>,
  error: IError,
  reset: IFormReset,
) => Promise<T> | T;

export type IOnSubmitHandler = (
  validCallback?: ISubmitHandler,
  invalidCallback?: ISubmitErrorHandler,
) => (event: FormEvent<HTMLFormElement>) => void;

export type IWatch = <V extends IFormValues>(
  callback: (values: V) => void,
  names?: string[] | string,
) => IUnSubscribe;

export type IWatchSubscribe = (
  subscriber: IWatchSubscriber,
  names?: string[] | string,
) => IUnSubscribe;

export type IStateSubscribe = (subscriber: IStateSubscriber) => IUnSubscribe;

export interface IFormHandlers {
  onChange: IOnChangeHandler;
  onError: IOnErrorHandler;
  onReset: IOnResetHandler;
  onSubmit: IOnSubmitHandler;
  watch: IWatch;
}

export interface IFormContext extends IFormHandlers {
  errors: IError;
  form: RefObject<HTMLFormElement>;
  messages?: IMessages;
  mode: IFormMode;
  register: IRegister;
  reset: IFormReset;
  revalidateMode: IFormRevalidateMode;
  states: IFormStates;
  subscribe: IStateSubscribe;
  unregister: IUnregister;
  useNativeValidation: boolean;
  validate: IFormValidate;
}
