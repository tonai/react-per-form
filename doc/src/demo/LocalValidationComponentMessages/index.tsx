import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useInput } from 'react-swift-form';

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

export default function Demo({ useNativeValidation }: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form
      messages={globalMessages}
      onSubmit={handleSubmit}
      useNativeValidation={useNativeValidation}
    >
      <Input />
      <button type="submit">Submit</button>
    </Form>
  );
}
