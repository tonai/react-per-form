import { FormEvent } from 'react';
import { IFormValues } from 'react-form-validation';

export function handleSubmit(
  event: FormEvent<HTMLFormElement>,
  values: IFormValues,
) {
  event.preventDefault();
  console.log('Submit!', values);
}
