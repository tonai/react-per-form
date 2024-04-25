import type { FormEvent } from 'react';
import type { IFormValues } from 'react-per-form';
import type { IProps } from '../types';
import { FormProvider, useForm, useFormStates } from 'react-per-form';
import { delay } from '../time';

const defaultValues = { a: 'foo' };
const validator = (value: string) => (values: IFormValues, names: string[]) =>
  delay(
    String(values[names[0]]).includes(value)
      ? ''
      : `Value does not include "${value}"`,
  );
const validators = {
  a: validator('foo'),
  b: validator('bar'),
  c: validator('baz'),
};

function Submit() {
  const states = useFormStates();
  return (
    <>
      <div className="actions">
        <button disabled={states.isSubmitting} type="submit">
          Submit
        </button>
        <button type="reset">Reset</button>
      </div>
      <pre>{JSON.stringify(states, null, 2)}</pre>
    </>
  );
}

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
    return delay();
  }

  const { formProps, ...context } = useForm({
    ...props,
    defaultValues,
    onSubmit: handleSubmit,
    validators,
  });
  const { errors } = context;

  return (
    <FormProvider {...context}>
      <form {...formProps}>
        <input name="a" required />
        {errors.all.a && <div className="error">{errors.all.a}</div>}
        <input defaultValue="bar" name="b" required />
        {errors.all.b && <div className="error">{errors.all.b}</div>}
        <input name="c" required />
        {errors.all.c && <div className="error">{errors.all.c}</div>}
        <Submit />
      </form>
    </FormProvider>
  );
}
