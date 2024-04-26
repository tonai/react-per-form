'use client';

import type { Dayjs } from 'dayjs';
import type { Dispatch, ReactElement, SetStateAction } from 'react';

import { DatePicker } from '@mui/x-date-pickers';
import { useInputs, useWatch } from '@per-form/react';
import dayjs from 'dayjs';

import { muiValidator } from '../../helpers/validators';

const defaultValues = {
  mui: null, // This is needed to avoid getting the string 'MM/DD/YYYY' in the muiValidator function
  number: 0,
};
const names = ['number', 'number-controlled', 'mui'];
const messages = {
  minDate: 'Select a date in the future',
};
const transformers = {
  number: Number,
  'number-controlled': Number,
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

function Lib(props: ILibProps): ReactElement {
  const { muiValue, numberValue, setMuiValue, setNumberValue } = props;
  const { errors, onChange, onError } = useInputs({
    defaultValues,
    messages,
    names,
    onChangeOptOut: 'mui',
    transformers,
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
            required
            type="number"
          />
          {Boolean(errors.all.number) && (
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
            onChange={onChange(setNumberValue)}
            required
            type="number"
            value={numberValue}
          />
          {Boolean(errors.all['number-controlled']) && (
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
            minDate={dayjs()}
            name="mui"
            onChange={onChange(setMuiValue, { name: 'mui' })}
            onError={onError('mui')}
            slotProps={{
              textField: {
                inputProps: { 'data-testid': 'mui' },
                required: true,
              },
            }}
            value={muiValue}
          />
          {Boolean(errors.all.mui) && (
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
            onChange={onChange(setMuiValue, {
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
