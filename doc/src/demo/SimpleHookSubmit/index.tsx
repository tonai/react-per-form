import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { type IError, type IFormValues, useForm } from 'react-swift-form';

export default function Demo(props: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  function handleSubmitError(e: FormEvent<HTMLFormElement>, errors: IError) {
    console.log(errors);
  }

  const { errors, formProps, onSubmit } = useForm(props);

  return (
    <form {...formProps} onSubmit={onSubmit(handleSubmit, handleSubmitError)}>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
