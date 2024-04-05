import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormContext, type IFormValues } from 'react-swift-form';

const validators = {
  sum: {
    names: ['a', 'b'],
    validator: (values: IFormValues) =>
      Number(values.a) + Number(values.b) === 42
        ? ''
        : 'The sum must be equal to 42',
  },
};

export default function Demo({ useNativeValidation }: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form
      onSubmit={handleSubmit}
      useNativeValidation={useNativeValidation}
      validators={validators}
    >
      {({ errors }: IFormContext) => (
        <>
          <input name="a" required type="number" />
          <input name="b" required type="number" />
          {errors.validator.sum?.error && (
            <div className="error">{errors.validator.sum.error}</div>
          )}
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
