export type IFormMode = 'blur' | 'change' | 'check' | 'fix' | 'none';

export type IValidate = (
  mode: IFormMode,
  formData: FormData,
  name?: string,
) => void;

export type IFormValidate = (
  mode: IFormMode,
  name?: string[] | string,
) => boolean;

export type IReset = () => void;

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

export interface IError {
  all?: Record<string, string>;
  main?: string;
  native?: Record<string, string>;
  validator?: Record<string, string>;
}

export interface IFormContext {
  checkValidity: (mode: IFormMode) => void;
  errors: IError;
  isValid: boolean;
  messages?: IValidityMessages;
  mode: IFormMode;
  removeValidator: (name: string) => void;
  resetForm: () => void;
  setValidator: (name: string, validate: IValidate, reset: IReset) => void;
  useNativeValidation: boolean;
  validateForm: IFormValidate;
}

export type IValidityMessages = Partial<Record<keyof ValidityState, string>>;
