import { type FormEvent, useEffect, useState } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useFormContext } from '@per-form/react';

function Input() {
  const { errors, watch } = useFormContext();

  const [text, setText] = useState('');
  useEffect(() => {
    return watch<{ text: string }>(({ text }) => setText(text), 'text');
  }, [watch]);

  return (
    <>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <div>value = {text}</div>
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
