import type { FormEvent } from 'react';
import type { IFormValues } from 'react-per-form';

export function handleSubmit(
  _event: FormEvent<HTMLFormElement>,
  values: IFormValues,
): void {
  console.log('Submit!', values);
}
