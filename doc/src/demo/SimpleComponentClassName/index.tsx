import type { FormEvent } from 'react';
import { Form, type IFormContext, type IFormValues } from 'react-swift-form';
import clsx from 'clsx';

export default function Demo() {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form onSubmit={handleSubmit} useNativeValidation={false}>
      {({ errors }: IFormContext) => (
        <>
          <input
            className={clsx({ 'has-error': errors.all.text })}
            name="text"
            required
          />
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}
