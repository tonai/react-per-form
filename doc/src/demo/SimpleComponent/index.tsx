import type { FormEvent } from 'react';
import { Form, type IFormValues } from 'react-swift-form';

export default function Demo() {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <input name="text" required />
      <button type="submit">Submit</button>
    </Form>
  );
}
