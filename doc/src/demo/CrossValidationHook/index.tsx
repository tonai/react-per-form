import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from 'react-per-form';

const validators = {
  sum: {
    names: ['a', 'b'],
    validator: (values: IFormValues) =>
      Number(values.a) + Number(values.b) === 42
        ? ''
        : 'The sum must be equal to 42',
  },
};

export default function Demo({ useNativeValidation }: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { errors, formProps } = useForm({
    onSubmit: handleSubmit,
    useNativeValidation,
    validators,
  });

  return (
    <form {...formProps}>
      <input name="a" required type="number" />
      <input name="b" required type="number" />
      {errors.validator.sum?.error && (
        <div className="error">{errors.validator.sum.error}</div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}
