import { type FormEvent } from 'react';
import { Form, type IFormValues, useFormErrors } from 'react-swift-form';

function Input() {
  const errors = useFormErrors();
  const error = errors.all.text;
  return (
    <>
      <input className={error ? 'has-error' : ''} name="text" required />
      {error && <div className="error">{error}</div>}
    </>
  );
}

export default function Simple({ log }: { log: (data: unknown) => void }) {
  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
  ) {
    event.preventDefault();
    log(values);
  }

  return (
    <Form onSubmit={handleSubmit} useNativeValidation={false}>
      <Input />
      <input type="submit" />
    </Form>
  );
}
