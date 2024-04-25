import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useInputs } from 'react-per-form';

const validator = (values: IFormValues) =>
  Number(values.a) + Number(values.b) === 42
    ? ''
    : 'The sum must be equal to 42';
const names = ['a', 'b'];

function Inputs() {
  const { errors } = useInputs({ names, validators: validator });
  return (
    <>
      <input name="a" required type="number" />
      <input name="b" required type="number" />
      {errors.validator['a,b']?.error && (
        <div className="error">{errors.validator['a,b'].error}</div>
      )}
    </>
  );
}

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit}>
      <Inputs />
      <button type="submit">Submit</button>
    </Form>
  );
}
