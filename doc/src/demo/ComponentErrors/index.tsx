import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import { type FormEvent, useState } from 'react';
import type { IProps } from '../types';
import { Form, type IFormValues } from 'react-swift-form';

const validators = {
  mui: (values: IFormValues) => {
    const date = values.mui as Dayjs;
    return date?.date() > 15 ? '' : 'Choose a date after the 15th.';
  },
};

const defaultValues = { mui: null };

export default function Demo(props: IProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  function handleReset() {
    setValue(null);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form
      {...props}
      defaultValues={defaultValues}
      onReset={handleReset}
      onSubmit={handleSubmit}
      validators={validators}
    >
      {({ errors, onChange, onError }) => (
        <>
          <DatePicker
            minDate={dayjs()}
            name="mui"
            onChange={onChange({ callback: setValue, name: 'mui' })}
            onError={onError('mui')}
            slotProps={{ textField: { required: true } }}
            value={value}
          />
          {errors.all.mui && <div className="error">{errors.all.mui}</div>}
          <div className="actions">
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </>
      )}
    </Form>
  );
}