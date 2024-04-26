import type { FormEvent } from 'react';
import type { IFormValues } from '@per-form/react';
import type { IProps } from '../types';
import { FormProvider, useForm, useInputs } from '@per-form/react';

const validator = (values: IFormValues) =>
  Number(values.a) + Number(values.b) === 42
    ? ''
    : 'The sum must be equal to 42';
const names = ['a', 'b'];

function Inputs() {
  const { errors } = useInputs({ names, validators: validator });
  return (
    <>
      <input name="a" required type="number" />
      <input name="b" required type="number" />
      {errors.validator['a,b']?.error && (
        <div className="error">{errors.validator['a,b'].error}</div>
      )}
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
        <Inputs />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
