import { Reset, Submit, formContext, useForm } from 'react-form-validation';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Filters from '../../components/Filters/Filters';
import { muiValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';
import { useState } from 'react';
import dayjs from 'dayjs';

const messages = {
  valueMissing: 'Did you miss something ?',
  minDate: 'Select a date in the future',
};
const validators = {
  mui: muiValidator,
};

export default function HookLibForm() {
  const [numberValue, setNumberValue] = useState(0);
  const [muiValue, setMuiValue] = useState(null);
  const { filtersProps, hookProps } = useFilters();
  const { formProps, ...context } = useForm({
    ...hookProps,
    defaultValues: {
      // This is needed to avoid getting the string 'MM/DD/YYYY' in the muiValidator function
      mui: null,
    },
    messages,
    validators,
  });
  const { errors, onChange, onError } = context;

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
            <label htmlFor="file">number (controlled)</label>
            <div className="input">
              <input
                data-testid="number-controlled"
                name="number-controlled"
                onChange={onChange('number-controlled', Number, setNumberValue)}
                required
                type="number"
                value={numberValue}
              />
              {errors.all?.['number-controlled'] && (
                <div className="error" data-testid="number-error">
                  {errors.all['number-controlled']}
                </div>
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="file">datepicker</label>
            <div className="input">
              <DatePicker
                name="mui"
                minDate={dayjs()}
                onChange={onChange('mui', null, setMuiValue)}
                onError={onError('mui')}
                slotProps={{
                  textField: {
                    inputProps: { 'data-testid': 'mui' },
                    required: true,
                  },
                }}
                value={muiValue}
              />
              {errors.all?.mui && (
                <div className="error" data-testid="mui-error">
                  {errors.all.mui}
                </div>
              )}
            </div>
          </div>
          {/* Alternative syntax */}
          {/* <div className="field">
            <label htmlFor="file">datepicker</label>
            <div className="input">
              <DatePicker
                name="mui"
                minDate={dayjs()}
                onChange={onChange(
                  'mui',
                  null,
                  null,
                  (_, { validationError }) => validationError,
                )}
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
          </div> */}
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
