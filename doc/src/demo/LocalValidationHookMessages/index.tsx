import type { FormEvent } from 'react';
import type { IFormValues } from 'react-swift-form';
import type { IProps } from '../types';
import { FormProvider, useForm, useInput } from 'react-swift-form';

const validator = (values: IFormValues) =>
  String(values.text).includes('foo') ? '' : 'fooError';

const globalMessages = { valueMissing: 'did you miss something ?' };
const localMessages = { fooError: 'Value does not include "foo"' };

function Input() {
  const { errors } = useInput({
    messages: localMessages,
    name: 'text',
    validator,
  });
  return (
    <>
      <input name="text" required />
      {errors.all.text && <div className="error">{errors.all.text}</div>}
    </>
  );
}

export default function Demo({ useNativeValidation }: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  const { formProps, ...context } = useForm({
    messages: globalMessages,
    onSubmit: handleSubmit,
    useNativeValidation,
  });

  return (
    <FormProvider {...context}>
      <form {...formProps}>
        <Input />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
