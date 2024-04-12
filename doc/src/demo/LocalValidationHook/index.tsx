import type { FormEvent } from 'react';
import type { IFormValues } from 'react-swift-form';
import type { IProps } from '../types';
import { FormProvider, useForm, useInput } from 'react-swift-form';

const validator = (values: IFormValues) =>
  String(values.text).includes('foo') ? '' : 'Value does not include "foo"';

function Input() {
  const { errors } = useInput({ name: 'text', validator });
  return (
    <>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
    </>
  );
}

export default function Demo({ useNativeValidation }: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  const { formProps, ...context } = useForm({
    onSubmit: handleSubmit,
    useNativeValidation,
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
