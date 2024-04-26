import type { FormEvent } from 'react';
import { type IFormValues, useForm } from '@per-form/react';
import clsx from 'clsx';

export default function Demo() {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { errors, formProps } = useForm({
    onSubmit: handleSubmit,
    useNativeValidation: false,
  });

  return (
    <form {...formProps}>
      <input
        className={clsx({ 'has-error': errors.all.text })}
        name="text"
        required
      />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}
