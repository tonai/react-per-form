import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from 'react-swift-form';
import { delay } from '../time';

const validators = {
  text: (values: IFormValues) =>
    delay(
      String(values.text).includes('foo') ? '' : 'Value does not include "foo"',
    ),
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
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
