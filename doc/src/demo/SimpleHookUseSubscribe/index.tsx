import { type FormEvent, useState } from 'react';
import type { IProps } from '../types';
import {
  FormProvider,
  type IFormValues,
  useForm,
  useSubscribe,
} from 'react-swift-form';

function Submit() {
  const [isValid, setIsValid] = useState(false);
  useSubscribe(({ isValid }) => setIsValid(isValid));

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

  const { formProps, ...context } = useForm({
    ...props,
    onSubmit: handleSubmit,
  });
  const { errors } = context;

  return (
    <FormProvider {...context}>
      <form {...formProps}>
        <input name="text" required />
        {errors.all.text && <div className="error">{errors.all.text}</div>}
        <Submit />
      </form>
    </FormProvider>
  );
}
