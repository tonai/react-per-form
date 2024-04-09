import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useFormContext } from 'react-swift-form';

function Input() {
  const { errors } = useFormContext();
  return (
    <>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
    </>
  );
}

export default function Demo(props: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit} useNativeValidation={false}>
      <Input />
      <button type="submit">Submit</button>
    </Form>
  );
}
