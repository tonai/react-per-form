import type { IProps } from '../types';
import { type FormEvent, useRef, useState } from 'react';
import { Form, type IFormContext, type IFormValues } from 'react-swift-form';

function validator(values: IFormValues) {
  return Object.values(values).reduce((a, b) => Number(a) + Number(b), 0) === 42
    ? ''
    : 'The sum must be equal to 42';
}

export default function Demo({ useNativeValidation }: IProps) {
  const [names, setNames] = useState<string[]>([]);
  const ref = useRef(0);

  function handleAdd() {
    setNames(names.concat(`dynamic-${ref.current++}`));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form
      onSubmit={handleSubmit}
      useNativeValidation={useNativeValidation}
      validators={{ sum: { names, validator } }}
    >
      {({ errors }: IFormContext) => (
        <>
          <button onClick={handleAdd} type="button">
            Add input
          </button>
          {names.map((name) => (
            <input key={name} name={name} required type="number" />
          ))}
          {errors.main && <div className="error">{errors.main.error}</div>}
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
