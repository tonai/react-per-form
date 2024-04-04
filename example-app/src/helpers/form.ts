import { FormEvent } from 'react';
import { IFormValues } from 'react-swift-form';

export function handleSubmit(
  event: FormEvent<HTMLFormElement>,
  values: IFormValues,
) {
  event.preventDefault();
  console.log('Submit!', values);
}
