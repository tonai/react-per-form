import type { FormEvent } from 'react';
import type { IFormValues } from 'react-swift-form';

export function handleSubmit(
  _event: FormEvent<HTMLFormElement>,
  values: IFormValues,
): void {
  console.log('Submit!', values);
}
