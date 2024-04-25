import type { FormEvent } from 'react';
import type { IProps } from '../types';
import {
  Form,
  type IError,
  type IFormContext,
  type IFormValues,
} from 'react-per-form';

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  function handleSubmitError(_e: FormEvent<HTMLFormElement>, errors: IError) {
    console.log(errors);
  }

  return (
    <Form {...props} onSubmit={handleSubmit} onSubmitError={handleSubmitError}>
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
