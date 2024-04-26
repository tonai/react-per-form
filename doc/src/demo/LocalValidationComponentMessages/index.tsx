import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useInput } from '@per-form/react';

const validator = (values: IFormValues) =>
  String(values.text).includes('foo') ? '' : 'fooError';

const globalMessages = { valueMissing: 'did you miss something ?' };
const localMessages = { fooError: 'Value does not include "foo"' };

function Input() {
  const { errors } = useInput({
    messages: localMessages,
    name: 'text',
    validator,
  });
  return (
    <>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
    </>
  );
}

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form {...props} messages={globalMessages} onSubmit={handleSubmit}>
      <Input />
      <button type="submit">Submit</button>
    </Form>
  );
}
