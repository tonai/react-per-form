import type { FormEvent } from 'react';
import type { IFormValues } from 'react-swift-form';
import type { IProps } from '../types';
import { FormProvider, useForm, useInput } from 'react-swift-form';

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
        <div className="actions">
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </div>
      </form>
    </FormProvider>
  );
}
