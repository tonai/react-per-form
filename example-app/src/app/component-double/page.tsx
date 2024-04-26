'use client';

import type { ReactElement } from 'react';

import { Form, Reset, Submit } from '@per-form/react';

import Double from '../../components/Double/Double';
import Filters from '../../components/Filters/Filters';
import { handleSubmit } from '../../helpers/form';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentDoubleForm(): ReactElement {
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
        <Double />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit data-testid="rpf-submit-disabled" disableOnError />
        </div>
      </Form>
    </>
  );
}
