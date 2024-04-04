import { type FormEvent } from 'react';
import { type IFormValues, useForm } from 'react-swift-form';

export default function Simple({ log }: { log: (data: unknown) => void }) {
  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
  ) {
    event.preventDefault();
    log(values);
  }

  const { formProps } = useForm({
    onSubmit: handleSubmit,
  });

  return (
    <form {...formProps}>
      <input name="text" required />
      <input type="submit" />
    </form>
  );
}
