import type { FormEvent } from 'react';
import type { IProps } from '../types';
import {
  Form,
  type IFormContext,
  type IFormValues,
  Submit,
} from 'react-swift-form';

export default function Demo(props: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit}>
      {({ errors }: IFormContext) => (
        <>
          <input name="text" required />
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <Submit disableOnError />
        </>
      )}
    </Form>
  );
}
