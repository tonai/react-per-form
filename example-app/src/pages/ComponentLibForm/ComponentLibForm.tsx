import { Error, Form, Reset, Submit } from 'react-form-validation';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Lib from '../../components/Lib/Lib';
import Filters from '../../components/Filters/Filters';
import { useFilters } from '../../hooks/useFilters';
import { handleSubmit } from '../../helpers/form';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentLibForm() {
  const { filtersProps, formData } = useFilters();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Filters {...filtersProps} />
      <Form
        {...formData}
        defaultValues={{ mui: null }}
        className="form"
        data-testid="form"
        messages={messages}
        onSubmit={handleSubmit}
      >
        <Lib />
        <Error className="error" global />
        <div className="form__actions">
          <Reset />
          <Submit />
          <Submit data-testid="rfv-submit-disabled" disableOnError />
        </div>
      </Form>
    </LocalizationProvider>
  );
}
