import type { FormEvent } from 'react';
import type { IProps } from '../types';
import {
  Error,
  FormProvider,
  type IFormValues,
  useForm,
} from 'react-swift-form';

const validators = {
  text: (values: IFormValues) =>
    String(values.text).includes('foo') ? '' : 'Value does not include "foo"',
};

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { formProps, ...context } = useForm({
    ...props,
    onSubmit: handleSubmit,
    validators,
  });

  return (
    <FormProvider {...context}>
      <form {...formProps}>
        <input name="text" required />
        <div>
          main error = <Error Component="span" />
        </div>
        <div>
          main global error = <Error Component="span" global />
        </div>
        <div>
          native error = <Error Component="span" errorPath="native" />
        </div>
        <div>
          native text error = <Error Component="span" errorPath="native.text" />
        </div>
        <div>
          validator error = <Error Component="span" errorPath="validator" />
        </div>
        <input type="submit" />
      </form>
    </FormProvider>
  );
}
