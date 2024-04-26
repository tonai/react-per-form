import type { IProps } from '../types';
import { type FormEvent } from 'react';
import { Form, type IFormContext, type IFormValues } from '@per-form/react';
import { useData } from '../useData';

export default function Demo(props: IProps) {
  const data = useData();

  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit}>
      {({ errors }: IFormContext) => (
        <>
          <input defaultValue={data} name="text" required />
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <div className="actions">
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </>
      )}
    </Form>
  );
}
