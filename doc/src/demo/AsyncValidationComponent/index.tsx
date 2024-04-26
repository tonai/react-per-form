import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormContext, type IFormValues } from '@per-form/react';
import { delay } from '../time';

const validators = {
  text: (values: IFormValues) =>
    delay(
      String(values.text).includes('foo') ? '' : 'Value does not include "foo"',
    ),
};

export default function Demo({ useNativeValidation }: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form
      onSubmit={handleSubmit}
      useNativeValidation={useNativeValidation}
      validators={validators}
    >
      {({ errors }: IFormContext) => (
        <>
          <input name="text" required />
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
