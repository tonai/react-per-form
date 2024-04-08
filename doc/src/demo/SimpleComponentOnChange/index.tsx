import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormContext, type IFormValues } from 'react-swift-form';

export default function Demo(props: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit}>
      {({ errors, onChange }: IFormContext) => (
        <>
          <input
            name="count"
            onChange={onChange({ transformer: Number })}
            required
            type="number"
          />
          {errors.all.count && <div className="error">{errors.all.count}</div>}
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
