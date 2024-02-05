export type IFormMode = 'blur' | 'change' | 'check' | 'fix' | 'none';

export type IValidate = (
  mode: IFormMode,
  formData: FormData,
  name?: string,
) => void;

export type IFormValidate = (
  mode: IFormMode,
  name?: string | string[],
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
  validator: IValidatorMultiple;
  names: string[];
}

export interface IError {
  all?: Record<string, string>;
  native?: Record<string, string>;
  main?: string;
  validator?: Record<string, string>;
}

export interface IFormContext {
  checkValidity: (mode: IFormMode) => void;
  errors: IError;
  isValid: boolean;
  mode: IFormMode;
  removeValidator: (name: string) => void;
  resetForm: () => void;
  setValidator: (name: string, validate: IValidate, reset: IReset) => void;
  useNativeValidation: boolean;
  validateForm: IFormValidate;
}
