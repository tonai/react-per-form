import type { FormEvent } from 'react';
import type { IFormValues } from 'react-per-form';
import type { IProps } from '../types';
import { FormProvider, useForm, useInput } from 'react-per-form';

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

  const { formProps, ...context } = useForm({
    ...props,
    onSubmit: handleSubmit,
  });

  return (
    <FormProvider {...context}>
      <form {...formProps}>
        <Input />
        <div className="actions">
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </form>
    </FormProvider>
  );
}
