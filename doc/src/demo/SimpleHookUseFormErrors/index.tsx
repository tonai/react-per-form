import type { FormEvent } from 'react';
import type { IFormValues } from '@per-form/react';
import type { IProps } from '../types';
import { FormProvider, useForm, useFormErrors } from '@per-form/react';

function Inputs() {
  const errors = useFormErrors();
  return (
    <>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
    </>
  );
}

export default function Demo({ useNativeValidation }: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { formProps, ...context } = useForm({
    onSubmit: handleSubmit,
    useNativeValidation,
  });

  return (
    <FormProvider {...context}>
      <form {...formProps}>
        <Inputs />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
