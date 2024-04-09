import { useInputs, useWatch } from 'react-swift-form';
import { DatePicker } from '@mui/x-date-pickers';
import { Dispatch, SetStateAction } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { muiValidator } from '../../helpers/validators';

const names = ['number', 'number-controlled', 'mui'];
const messages = {
  minDate: 'Select a date in the future',
};
const validators = {
  mui: muiValidator,
};

interface ILibProps {
  muiValue: Dayjs | null;
  numberValue: number;
  setMuiValue: Dispatch<SetStateAction<Dayjs | null>>;
  setNumberValue: Dispatch<SetStateAction<number>>;
}

function Lib(props: ILibProps) {
  const { muiValue, numberValue, setMuiValue, setNumberValue } = props;
  const { errors, onChange, onError } = useInputs({
    messages,
    names,
    validators,
  });
  const { mui } = useWatch<{ mui: Dayjs | null }>('mui');

  return (
    <>
      <div className="field">
        <label htmlFor="file">number (uncontrolled)</label>
        <div className="input">
          <input
            data-testid="number"
            min="3"
            name="number"
            onChange={onChange({ transformer: Number })}
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
            onChange={onChange({
              callback: setNumberValue,
              transformer: Number,
            })}
            required
            type="number"
            value={numberValue}
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
            onChange={onChange({ callback: setMuiValue, name: 'mui' })}
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
      <div>
        Date is <span data-testid="watch">{mui?.format('DD/MM/YYYY')}</span>
      </div>
      {/* Alternative syntax */}
      {/* <div className="field">
        <label htmlFor="file">datepicker</label>
        <div className="input">
          <DatePicker
            name="mui"
            minDate={dayjs()}
            onChange={onChange({
              getError: (_, { validationError }) => validationError,
              name: 'mui'
            })}
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
