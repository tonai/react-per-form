import type { FormEvent } from 'react';
import { type IFormValues, useForm } from 'react-swift-form';

export default function Demo() {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
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
