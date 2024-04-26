import type { IFormValues } from '@per-form/react';
import type { FormEvent } from 'react';

export function handleSubmit(
  _event: FormEvent<HTMLFormElement>,
  values: IFormValues,
): void {
  console.log('Submit!', values);
}
