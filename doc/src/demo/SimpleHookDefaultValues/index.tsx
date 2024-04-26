import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from '@per-form/react';

const defaultValues = { count: 0 };

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { errors, formProps } = useForm({
    ...props,
    defaultValues,
    onSubmit: handleSubmit,
  });

  return (
    <form {...formProps}>
      <input name="count" required type="number" />
      {errors.all.count && <div className="error">{errors.all.count}</div>}
      <div className="actions">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  );
}
