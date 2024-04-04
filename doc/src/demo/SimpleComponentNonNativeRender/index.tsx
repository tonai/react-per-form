import { type FormEvent } from 'react';
import { Form, type IFormContext, type IFormValues } from 'react-swift-form';

export default function Simple({ log }: { log: (data: unknown) => void }) {
  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    values: IFormValues,
  ) {
    event.preventDefault();
    log(values);
  }

  return (
    <Form onSubmit={handleSubmit} useNativeValidation={false}>
      {({ errors }: IFormContext) => (
        <>
          <input
            className={errors.all.text ? 'has-error' : ''}
            name="text"
            required
          />
          {errors.all.text && <div className="error">{errors.all.text}</div>}
          <input type="submit" />
        </>
      )}
    </Form>
  );
}
