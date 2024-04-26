'use client';

import type { IFormValues } from '@per-form/react';
import type { Dayjs } from 'dayjs';
import type { ReactElement } from 'react';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormProvider, Reset, Submit, useForm } from '@per-form/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import Filters from '../../components/Filters/Filters';
import { handleSubmit } from '../../helpers/form';
import { muiValidator } from '../../helpers/validators';
import { useFilters } from '../../hooks/useFilters';

const messages = {
  minDate: 'Select a date in the future',
  rangeUnderflow: 'Value is too low',
  valueMissing: 'Did you miss something ?',
};
const validators = {
  mui: muiValidator,
};
const defaultValues = {
  mui: null, // This is needed to avoid getting the string 'MM/DD/YYYY' in the muiValidator function
  number: 0,
};
const transformers = {
  number: Number,
  'number-controlled': Number,
};

export default function HookLibForm(): ReactElement {
  const [numberValue, setNumberValue] = useState(0);
  const [muiValue, setMuiValue] = useState(null);
  const { filtersProps, formData } = useFilters();
  const { formProps, ...context } = useForm({
    ...formData,
    defaultValues,
    messages,
    onChangeOptOut: 'mui',
    transformers,
    validators,
  });
  const { errors, onChange, onError, onReset, onSubmit, watch } = context;

  const [mui, setMui] = useState<Dayjs | null>(null);
  useEffect(() => {
    return watch<{ mui: Dayjs | null }>(({ mui }) => setMui(mui), 'mui');
  }, [watch]);

  function handleReset(): IFormValues {
    setNumberValue(0);
    setMuiValue(null);
    return { number: 12 };
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Filters {...filtersProps} />
      <FormProvider {...context}>
        <form
          {...formProps}
          className="form"
          data-testid="form"
          onReset={onReset(handleReset)}
          onSubmit={onSubmit(handleSubmit)}
        >
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
          <div className="form__actions">
            <Reset />
            <Submit />
            <Submit data-testid="rpf-submit-disabled" disableOnError />
          </div>
        </form>
      </FormProvider>
    </LocalizationProvider>
  );
}
