import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useFormValid } from 'react-swift-form';

function Submit() {
  const valid = useFormValid();
  return (
    <button disabled={!valid} type="submit">
      Submit
    </button>
  );
}

export default function Demo(props: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit} useNativeValidation={false}>
      {({ errors }) => (
        <>
          <input name="text" required />
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <Submit />
        </>
      )}
    </Form>
  );
}
