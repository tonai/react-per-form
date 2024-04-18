import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useFormErrors } from 'react-swift-form';

function Input() {
  const errors = useFormErrors();
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
    <Form {...props} onSubmit={handleSubmit}>
      <Input />
      <button type="submit">Submit</button>
    </Form>
  );
}
