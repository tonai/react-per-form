'use client';

import type { ReactElement } from 'react';

import { useFormState } from 'react-dom';
import { Form, Reset, Submit } from 'react-swift-form';

import { serverAction } from '../../actions';
import Filters from '../../components/Filters/Filters';
import Loader from '../../components/Loader/Loader';
import Simple from '../../components/Simple/Simple';
import { handleSubmit } from '../../helpers/form';
import { globalFooValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';

const initialStates = {
  message: '',
};

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentSimpleForm(): ReactElement {
  const [state, formAction] = useFormState(serverAction, initialStates);
  const { filtersProps, formData } = useFilters();

  return (
    <>
      <Filters {...filtersProps} />
      <Form
        {...formData}
        action={formAction}
        className="form"
        data-testid="form"
        messages={messages}
        onSubmit={handleSubmit}
        validators={{
          foobar: { names: ['foo'], validator: globalFooValidator },
        }}
      >
        <Simple name="foo" required />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit data-testid="rsf-submit-disabled" disableOnError />
          <Loader />
        </div>
        <p
          aria-live="polite"
          className="sr-only"
          data-testid="message"
          role="status"
        >
          {state.message}
        </p>
      </Form>
    </>
  );
}
