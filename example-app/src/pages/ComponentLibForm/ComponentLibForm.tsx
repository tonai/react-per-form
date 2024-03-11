import { Error, Form, Reset, Submit } from 'react-form-validation';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Lib from '../../components/Lib/Lib';
import Filters from '../../components/Filters/Filters';
import { globalFooValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

export default function ComponentLibForm() {
  const { filtersProps, hookProps } = useFilters();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Filters {...filtersProps} />
      <Form
        {...hookProps}
        defaultValues={{ mui: null }}
        className="form"
        data-testid="form"
        messages={messages}
        validators={{
          foobar: { validator: globalFooValidator, names: ['foo'] },
        }}
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
