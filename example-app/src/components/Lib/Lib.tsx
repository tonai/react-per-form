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
      <div>
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
      <div>
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
    </>
  );
}

export default Lib;
