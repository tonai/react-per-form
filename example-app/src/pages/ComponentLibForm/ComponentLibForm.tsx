import { Error, Form, Reset, Submit } from 'react-swift-form';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import { Dayjs } from 'dayjs';
import Lib from '../../components/Lib/Lib';
import Filters from '../../components/Filters/Filters';
import { useFilters } from '../../hooks/useFilters';
import { handleSubmit } from '../../helpers/form';

const messages = {
  rangeUnderflow: 'Value is too low',
  valueMissing: 'Did you miss something ?',
};

export default function ComponentLibForm() {
  const [numberValue, setNumberValue] = useState(0);
  const [muiValue, setMuiValue] = useState<Dayjs | null>(null);
  const { filtersProps, formData } = useFilters();

  function handleReset() {
    setNumberValue(0);
    setMuiValue(null);
    return { number: 12 };
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Filters {...filtersProps} />
      <Form
        {...formData}
        defaultValues={{
          mui: null, // This is needed to avoid getting the string 'MM/DD/YYYY' in the muiValidator function
          number: 0,
        }}
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
          <Submit data-testid="rsf-submit-disabled" disableOnError />
        </div>
      </Form>
    </LocalizationProvider>
  );
}
