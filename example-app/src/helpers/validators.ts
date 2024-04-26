import type { IFormValues } from '@per-form/react';
import type { Dayjs } from 'dayjs';

export function fooValidator(values: IFormValues): Promise<string> {
  return Promise.resolve(
    String(values.foo).includes('foo') ? '' : 'Value does not include "foo"',
  );
}

export function doubleValidator(values: IFormValues, names: string[]): string {
  if (values[names[0]] === '' || values[names[1]] === '') {
    return '';
  }
  return Number(values[names[0]]) < Number(values[names[1]])
    ? ''
    : 'Second value must be greater than first value';
}

export function dynamicValidator(values: IFormValues): string {
  return Object.values(values).reduce((a, b) => Number(a) + Number(b), 0) === 12
    ? ''
    : 'The sum must be equal to 12';
}

export function globalFooValidator(values: IFormValues): string {
  return String(values.foo).includes('bar')
    ? ''
    : 'Value should also contains "bar"';
}

export function colorValidator(values: IFormValues): string {
  const red = parseInt(String(values.color).slice(1, 3), 16);
  return red > 200 ? '' : 'The red part should be greater than 200';
}

export function radioValidator(values: IFormValues): string {
  return String(values.radio) === '3' ? '' : 'Select the third value';
}

export function rangeValidator(values: IFormValues): string {
  return Number(values.range) > 75 ? '' : 'The value should be greater than 75';
}

export function multipleValidator(name: string) {
  return (values: IFormValues): string => {
    const value = values[name];
    return value && value instanceof Array && value.length > 1
      ? ''
      : 'Select at least two options';
  };
}

export function muiValidator(values: IFormValues): string {
  const date = values.mui as Dayjs | null;
  return (date?.date() ?? 0) > 15 ? '' : 'Choose a date after the 15th.';
}
