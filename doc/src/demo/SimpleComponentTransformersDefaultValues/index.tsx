import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormContext, type IFormValues } from 'react-swift-form';

const defaultValues = { count: 0 };
const transformers = { count: Number };

export default function Demo(props: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form
      {...props}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      transformers={transformers}
    >
      {({ errors }: IFormContext) => (
        <>
          <input name="count" type="number" />
          {errors.all.count && <div className="error">{errors.all.count}</div>}
          <div className="actions">
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </>
      )}
    </Form>
  );
}
