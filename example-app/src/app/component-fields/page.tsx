'use client';

import type { ReactElement } from 'react';

import { Error, Form, Reset, Submit } from 'react-swift-form';

import Fields from '../../components/Fields/Fields';
import Filters from '../../components/Filters/Filters';
import { handleSubmit } from '../../helpers/form';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentFieldsForm(): ReactElement {
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
      >
        <Fields />
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
