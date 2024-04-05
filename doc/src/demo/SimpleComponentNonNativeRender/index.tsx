import type { FormEvent } from 'react';
import { Form, type IFormContext, type IFormValues } from 'react-swift-form';

export default function Demo() {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form onSubmit={handleSubmit} useNativeValidation={false}>
      {({ errors }: IFormContext) => (
        <>
          <input name="text" required />
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
