import { type FormEvent } from 'react';
import type { IProps } from '../types';
import {
  Form,
  type IFormValues,
  useFormErrors,
  useWatch,
} from 'react-swift-form';

function Input() {
  const errors = useFormErrors();
  const { text } = useWatch<{ text: string }>('text');
  return (
    <>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <div>value = {text}</div>
    </>
  );
}

export default function Demo(props: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
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
