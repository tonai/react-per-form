import { Dayjs } from 'dayjs';
import { IFormValues } from 'react-swift-form';

export function fooValidator(values: IFormValues) {
  return String(values.foo).includes('foo')
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

export function globalFooValidator(values: IFormValues) {
  return String(values.foo).includes('bar')
    ? ''
    : 'Value should also contains "bar"';
}

export function colorValidator(values: IFormValues) {
  const red = parseInt(String(values.color).slice(1, 3), 16);
  return red > 200 ? '' : 'The red part should be greater than 200';
}

export function radioValidator(values: IFormValues) {
  return String(values.radio) === '3' ? '' : 'Select the third value';
}

export function rangeValidator(values: IFormValues) {
  return Number(values.range) > 75 ? '' : 'The value should be greater than 75';
}

export function multipleValidator(name: string) {
  return (values: IFormValues) => {
    const value = values[name];
    return value && value instanceof Array && value.length > 1
      ? ''
      : 'Select at least two options';
  };
}

export function muiValidator(values: IFormValues) {
  return !values.mui || !(values.mui as Dayjs).isValid() ? 'Choose a date' : '';
}
