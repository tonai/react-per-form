import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormContext, type IFormValues } from '@per-form/react';

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit}>
      {({ errors, states }: IFormContext) => (
        <>
          <input name="text" required />
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <button disabled={!states.isValid} type="submit">
            Submit
          </button>
        </>
      )}
    </Form>
  );
}
