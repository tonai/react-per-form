import type { FormEvent } from 'react';
import type { IFormValues } from '@per-form/react';
import type { IProps } from '../types';
import { FormProvider, useForm, useFormValid } from '@per-form/react';

function Submit() {
  const isValid = useFormValid();
  return (
    <button disabled={!isValid} type="submit">
      Submit
    </button>
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
  const { errors } = context;

  return (
    <FormProvider {...context}>
      <form {...formProps}>
        <input name="text" required />
        {errors.all.text && <div className="error">{errors.all.text}</div>}
        <Submit />
      </form>
    </FormProvider>
  );
}
