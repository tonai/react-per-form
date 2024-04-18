import { type FormEvent, useState } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues, useFormValid } from 'react-swift-form';

function Submit() {
  const isValid = useFormValid();
  return (
    <button disabled={!isValid} type="submit">
      Submit
    </button>
  );
}

export default function Demo(props: IProps) {
  const [disabled, setDisabled] = useState(false);

  function handleToggle() {
    setDisabled((x) => !x);
  }

  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit}>
      {({ errors }) => (
        <>
          <div className="flex">
            <input disabled={disabled} name="text" required />
            <button onClick={handleToggle} type="button">
              {disabled ? 'Enable' : 'Disable'}
            </button>
          </div>
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <Submit />
        </>
      )}
    </Form>
  );
}
