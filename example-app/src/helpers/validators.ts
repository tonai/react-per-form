import { IFormValues } from 'react-form-validation';

export function hookFooValidator(value: FormDataEntryValue | null) {
  return String(value).includes('foo') ? '' : 'Value does not include "foo"';
}

export function nativeFooValidator(value: IFormValues) {
  return String(value.foo).includes('foo')
    ? ''
    : 'Value does not include "foo"';
}

export function doubleValidator(values: IFormValues, names: string[]) {
  if (values[names[0]] === '' || values[names[1]] === '') {
    return '';
  }
  return Number(values[names[0]]) < Number(values[names[1]])
    ? ''
    : 'Second value must be greater than first value';
}

export function dynamicValidator(values: IFormValues) {
  return Object.values(values).reduce((a, b) => Number(a) + Number(b), 0) === 12
    ? ''
    : 'The sum must be equal to 12';
}

export function globalValidatorMultiple(values: IFormValues) {
  return String(values.foo).includes('bar')
    ? ''
    : 'Value should also contains "bar"';
}
