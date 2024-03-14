import { useInputs } from 'react-form-validation';
import { DatePicker } from '@mui/x-date-pickers';
import { muiValidator } from '../../helpers/validators';

const names = ['number', 'mui'];
const validators = {
  mui: muiValidator,
};

function Lib() {
  const { errors, onChange } = useInputs({
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
    </>
  );
}

export default Lib;
