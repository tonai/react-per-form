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

  const { errors, formProps } = useForm({
    onSubmit: handleSubmit,
    useNativeValidation: false,
  });
  const error = errors.all.text;

  return (
    <form {...formProps}>
      <input className={error ? 'has-error' : ''} name="text" required />
      {error && <div className="error">{error}</div>}
      <input type="submit" />
    </form>
  );
}
