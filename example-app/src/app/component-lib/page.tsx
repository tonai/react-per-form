'use client';

import type { Dayjs } from 'dayjs';
import type { ReactElement } from 'react';
import type { IFormValues } from 'react-swift-form';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { Error, Form, Reset, Submit } from 'react-swift-form';

import Filters from '../../components/Filters/Filters';
import Lib from '../../components/Lib/Lib';
import { handleSubmit } from '../../helpers/form';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  rangeUnderflow: 'Value is too low',
  valueMissing: 'Did you miss something ?',
};
const defaultValues = {
  mui: null, // This is needed to avoid getting the string 'MM/DD/YYYY' in the muiValidator function
  number: 0,
};
const transformers = {
  number: Number,
  'number-controlled': Number,
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
        defaultValues={defaultValues}
        messages={messages}
        onChangeOptOut="mui"
        onReset={handleReset}
        onSubmit={handleSubmit}
        transformers={transformers}
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
          <Submit data-testid="rsf-submit-disabled" disableOnError />
        </div>
      </Form>
    </LocalizationProvider>
  );
}
