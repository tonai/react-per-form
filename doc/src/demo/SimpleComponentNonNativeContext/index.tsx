import type { FormEvent } from 'react';
import { Form, type IFormValues, useFormErrors } from 'react-swift-form';

function Input() {
  const errors = useFormErrors();
  return (
    <>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
    </>
  );
}

export default function Demo() {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form onSubmit={handleSubmit} useNativeValidation={false}>
      <Input />
      <button type="submit">Submit</button>
    </Form>
  );
}
