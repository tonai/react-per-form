import type { FormEvent } from 'react';
import type { IProps } from '../types';
import { Error, Form, type IFormValues } from 'react-swift-form';

const validators = {
  text: (values: IFormValues) =>
    String(values.text).includes('foo') ? '' : 'Value does not include "foo"',
};

export default function Demo(props: IProps) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>, values: IFormValues) {
    console.log(values);
  }

  return (
    <Form {...props} onSubmit={handleSubmit} validators={validators}>
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
    </Form>
  );
}
