import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useInput } from 'react-per-form';

function Input() {
  const { errors } = useInput({
    defaultValue: 0,
    name: 'count',
    transformer: Number,
  });
  return (
    <>
      <input name="count" required type="number" />
      {errors.all.count && <div className="error">{errors.all.count}</div>}
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
      <div className="actions">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </Form>
  );
}
