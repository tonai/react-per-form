import { useInputs } from 'react-form-validation';
import { DatePicker } from '@mui/x-date-pickers';
import { muiValidator } from '../../helpers/validators';

const validators = {
  mui: muiValidator,
};

function Lib() {
  const { errors, onChange } = useInputs({
    names: ['number', 'mui'],
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
          <div className="error" data-testid="simple-error">
            {errors.all.number}
          </div>
        )}
      </div>
      <div>
        <DatePicker
          data-testid="mui"
          name="mui"
          onChange={onChange('mui')}
          slotProps={{
            textField: {
              required: true,
            },
          }}
        />
        {errors.all?.mui && (
          <div className="error" data-testid="simple-error">
            {errors.all.mui}
          </div>
        )}
      </div>
    </>
  );
}

export default Lib;
