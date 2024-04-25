'use client';

import type { Dayjs } from 'dayjs';
import type { ReactElement } from 'react';
import type { IFormValues } from 'react-per-form';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { Error, Form, Reset, Submit } from 'react-per-form';

import Filters from '../../components/Filters/Filters';
import Lib from '../../components/Lib/Lib';
import { handleSubmit } from '../../helpers/form';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  rangeUnderflow: 'Value is too low',
  valueMissing: 'Did you miss something ?',
};

export default function ComponentLibForm(): ReactElement {
  const [numberValue, setNumberValue] = useState(0);
  const [muiValue, setMuiValue] = useState<Dayjs | null>(null);
  const { filtersProps, formData } = useFilters();

  function handleReset(): IFormValues {
    setNumberValue(0);
    setMuiValue(null);
    return { number: 12 };
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Filters {...filtersProps} />
      <Form
        {...formData}
        className="form"
        data-testid="form"
        messages={messages}
        onReset={handleReset}
        onSubmit={handleSubmit}
      >
        <Lib
          muiValue={muiValue}
          numberValue={numberValue}
          setMuiValue={setMuiValue}
          setNumberValue={setNumberValue}
        />
        <Error className="error" global />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit data-testid="rpf-submit-disabled" disableOnError />
        </div>
      </Form>
    </LocalizationProvider>
  );
}
