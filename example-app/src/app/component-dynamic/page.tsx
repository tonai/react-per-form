'use client';

import type { ReactElement } from 'react';

import { Form, Reset, Submit } from 'react-swift-form';

import Dynamic from '../../components/Dynamic/Dynamic';
import Filters from '../../components/Filters/Filters';
import { handleSubmit } from '../../helpers/form';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentDynamicForm(): ReactElement {
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
        <Dynamic />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit data-testid="rsf-submit-disabled" disableOnError />
        </div>
      </Form>
    </>
  );
}
