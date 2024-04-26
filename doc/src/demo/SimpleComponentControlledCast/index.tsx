import { type FormEvent, useState } from 'react';
import type { IProps } from '../types';
import { Form, type IFormContext, type IFormValues } from '@per-form/react';

const defaultValues = { count: 0 };
const transformers = { count: Number };

export default function Demo(props: IProps) {
  const [value, setValue] = useState(0);

  function handleReset() {
    setValue(0);
  }

  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form
      {...props}
      defaultValues={defaultValues}
      onReset={handleReset}
      onSubmit={handleSubmit}
      transformers={transformers}
    >
      {({ errors, onChange }: IFormContext) => (
        <>
          <input
            name="count"
            onChange={onChange(setValue)}
            required
            type="number"
            value={value}
          />
          <div>
            value = {value} ({typeof value})
          </div>
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
