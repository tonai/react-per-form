'use client';

import type { ReactElement } from 'react';

import { Error, Form, Reset, Submit } from 'react-swift-form';

import Filters from '../../components/Filters/Filters';
import Simple from '../../components/Simple/Simple';
import { handleSubmit } from '../../helpers/form';
import { globalFooValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentSimpleForm(): ReactElement {
  const { filtersProps, formData } = useFilters();

  return (
    <>
      <Filters {...filtersProps} />
      <Form
        {...formData}
        className="form"
        data-testid="form"
        messages={messages}
        onSubmit={handleSubmit}
        validators={{
          foobar: { names: ['foo'], validator: globalFooValidator },
        }}
      >
        <Simple name="foo" required />
        <Error className="error" global />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit data-testid="rsf-submit-disabled" disableOnError />
        </div>
      </Form>
    </>
  );
}
