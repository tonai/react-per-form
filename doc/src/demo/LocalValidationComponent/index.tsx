import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useInput } from 'react-swift-form';

const validator = (values: IFormValues) =>
  String(values.text).includes('foo') ? '' : 'Value does not include "foo"';

function Input() {
  const { errors } = useInput({ name: 'text', validator });
  return (
    <>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
    </>
  );
}

export default function Demo({ useNativeValidation }: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form onSubmit={handleSubmit} useNativeValidation={useNativeValidation}>
      <Input />
      <button type="submit">Submit</button>
    </Form>
  );
}
