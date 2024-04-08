import type { FormEvent } from 'react';
import type { IProps } from '../types';
import {
  Form,
  type IError,
  type IFormContext,
  type IFormValues,
} from 'react-swift-form';

export default function Demo(props: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  function handleSubmitError(e: FormEvent<HTMLFormElement>, errors: IError) {
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
