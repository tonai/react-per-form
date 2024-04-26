import type { FormEvent } from 'react';
import type { IFormValues } from '@per-form/react';
import type { IProps } from '../types';
import { FormProvider, useForm, useInput } from '@per-form/react';

const validator = (values: IFormValues) =>
  String(values.text).includes('foo') ? '' : 'Value does not include "foo"';

function Input() {
  const { errors } = useInput({ id: 'toto', name: 'text', validator });
  return (
    <>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
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
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
