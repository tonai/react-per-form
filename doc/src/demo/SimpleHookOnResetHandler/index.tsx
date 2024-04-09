import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from 'react-swift-form';

export default function Demo(props: IProps) {
  function handleReset(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    return { text: 'reset value' };
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  const { errors, formProps, onReset, onSubmit } = useForm(props);

  return (
    <form
      {...formProps}
      onReset={onReset(handleReset)}
      onSubmit={onSubmit(handleSubmit)}
    >
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <div className="actions">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  );
}
