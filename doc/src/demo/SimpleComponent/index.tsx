import { type FormEvent } from 'react';
import { Form, type IFormValues } from 'react-swift-form';

export default function Simple({ log }: { log: (data: unknown) => void }) {
  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
  ) {
    event.preventDefault();
    log(values);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <input name="text" required />
      <input type="submit" />
    </Form>
  );
}
