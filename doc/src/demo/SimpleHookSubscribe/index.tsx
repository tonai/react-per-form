import { type FormEvent, useEffect, useState } from 'react';
import type { IProps } from '../types';
import { type IFormValues, useForm } from 'react-swift-form';

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { errors, formProps, states, subscribe } = useForm({
    ...props,
    onSubmit: handleSubmit,
  });

  const [isValid, setIsValid] = useState(states.isValid);
  useEffect(() => {
    return subscribe(({ isValid }) => setIsValid(isValid));
  }, [subscribe]);

  return (
    <form {...formProps}>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
      <button disabled={!isValid} type="submit">
        Submit
      </button>
    </form>
  );
}
