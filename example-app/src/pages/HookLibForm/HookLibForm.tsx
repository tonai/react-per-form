import { Reset, Submit, formContext, useForm } from 'react-form-validation';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Filters from '../../components/Filters/Filters';
import { muiValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  valueMissing: 'Did you miss something ?',
};

const validators = {
  mui: muiValidator,
};

export default function HookLibForm() {
  const { filtersProps, hookProps } = useFilters();
  const { formProps, ...context } = useForm({
    ...hookProps,
    defaultValues: { mui: null },
    messages,
    validators,
  });
  const { errors, onChange } = context;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Filters {...filtersProps} />
      <formContext.Provider value={context}>
        <form className="form" data-testid="form" {...formProps}>
          <div className="field">
            <label htmlFor="file">number (uncontrolled)</label>
            <div className="input">
              <input
                data-testid="number"
                name="number"
                onChange={onChange('number', Number)}
                required
                type="number"
              />
              {errors.all?.number && (
                <div className="error" data-testid="number-error">
                  {errors.all.number}
                </div>
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="file">datepicker</label>
            <div className="input">
              <DatePicker
                name="mui"
                onChange={onChange('mui')}
                slotProps={{
                  textField: {
                    inputProps: { 'data-testid': 'mui' },
                    required: true,
                  },
                }}
              />
              {errors.all?.mui && (
                <div className="error" data-testid="mui-error">
                  {errors.all.mui}
                </div>
              )}
            </div>
          </div>
          <div className="form__actions">
            <Reset />
            <Submit />
            <Submit data-testid="rfv-submit-disabled" disableOnError />
          </div>
        </form>
      </formContext.Provider>
    </LocalizationProvider>
  );
}
