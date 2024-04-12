import type { FormEvent } from 'react';
import type { IProps } from '../types';
import {
  FormProvider,
  type IFormValues,
  Submit,
  useForm,
} from 'react-swift-form';

export default function Demo(props: IProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
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
        <Submit disableOnError />
      </form>
    </FormProvider>
  );
}