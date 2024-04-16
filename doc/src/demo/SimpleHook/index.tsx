import type { FormEvent } from 'react';
import { type IFormValues, useForm } from 'react-swift-form';

export default function Demo() {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { formProps } = useForm({
    onSubmit: handleSubmit,
  });

  return (
    <form {...formProps}>
      <input name="text" required />
      <button type="submit">Submit</button>
    </form>
  );
}
