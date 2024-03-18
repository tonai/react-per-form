import { useInputs } from 'react-form-validation';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import dayjs from 'dayjs';
import { muiValidator } from '../../helpers/validators';

const names = ['number', 'number-controlled', 'mui'];
const messages = {
  minDate: 'Select a date in the future',
};
const validators = {
  mui: muiValidator,
};

function Lib() {
  const [value, setValue] = useState(0);
  const { errors, onChange, onError } = useInputs({
    messages,
    names,
    validators,
  });

  return (
    <>
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
            onChange={onChange('number-controlled', Number, setValue)}
            required
            type="number"
            value={value}
          />
          {errors.all['number-controlled'] && (
            <div className="error" data-testid="number-controlled-error">
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
            onChange={onChange('mui', null)}
            onError={onError('mui')}
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
      {/* Alternative syntax */}
      {/* <div className="field">
        <label htmlFor="file">datepicker</label>
        <div className="input">
          <DatePicker
            name="mui"
            minDate={dayjs()}
            onChange={onChange('mui', null, null, (_, { validationError }) => validationError)}
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
    </>
  );
}

export default Lib;
