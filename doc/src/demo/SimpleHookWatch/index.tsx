import { type FormEvent, useEffect, useState } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from 'react-per-form';

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { errors, formProps, watch } = useForm({
    ...props,
    onSubmit: handleSubmit,
  });

  const [text, setText] = useState('');
  useEffect(() => {
    return watch<{ text: string }>(({ text }) => setText(text), 'text');
  }, [watch]);

  return (
    <form {...formProps}>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <div>value = {text}</div>
      <div className="actions">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  );
}
