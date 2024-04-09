import type { FormEvent } from 'react';
import type { IFormValues } from 'react-swift-form';
import type { IProps } from '../types';
import { FormProvider, useForm, useFormValid } from 'react-swift-form';

function Submit() {
  const valid = useFormValid();
  return (
    <button disabled={!valid} type="submit">
      Submit
    </button>
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
