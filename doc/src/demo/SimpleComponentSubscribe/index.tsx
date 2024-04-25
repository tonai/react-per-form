import { type FormEvent, useEffect, useState } from 'react';
import type { IProps } from '../types';
import {
  Form,
  type IFormContext,
  type IFormValues,
  useFormContext,
} from 'react-per-form';

function Submit() {
  const { states, subscribe } = useFormContext();

  const [isValid, setIsValid] = useState(states.isValid);
  useEffect(() => {
    return subscribe(({ isValid }) => setIsValid(isValid));
  }, [subscribe]);

  return (
    <button disabled={!isValid} type="submit">
      Submit
    </button>
  );
}

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit}>
      {({ errors }: IFormContext) => (
        <>
          <input name="text" required />
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <Submit />
        </>
      )}
    </Form>
  );
}
