import type { IProps } from '../types';
import { type FormEvent } from 'react';
import { type IFormValues, useForm } from 'react-swift-form';
import { useData } from '../useData';

export default function Demo(props: IProps) {
  const data = useData();

  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { errors, formProps } = useForm({
    ...props,
    onSubmit: handleSubmit,
  });

  return (
    <form {...formProps}>
      <input defaultValue={data} name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <div className="actions">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  );
}
