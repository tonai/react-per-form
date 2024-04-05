import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useInputs } from 'react-swift-form';

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

export default function Demo({ useNativeValidation }: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form onSubmit={handleSubmit} useNativeValidation={useNativeValidation}>
      <Inputs />
      <button type="submit">Submit</button>
    </Form>
  );
}
